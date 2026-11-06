import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const jsonPath = path.join(projectRoot, 'src/design-tokens/generated/tokens.json')
const cssPath = path.join(projectRoot, 'src/design-tokens/generated/tokens.css')
const expectedVariableCount = 441
const expectedAliasReferenceCount = 356
const expectedColorModes = ['SDS Light', 'SDS Dark']
const expectedResponsiveModes = ['Desktop', 'Mobile', 'Tablet', 'Desktop Wide']
const errors = []
const warnings = []

const fail = (message) => errors.push(message)
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
const propertyName = (collection, name) =>
  `--tgg-${slug(collection)}-${slug(name)}`
const isDimension = (collection, variable) => {
  if (variable.type !== 'FLOAT') return false
  if (collection.name === 'Size') return variable.name !== 'Number'
  if (collection.name === 'Responsive') {
    return ['Device Width', 'Root Font Size'].includes(variable.name)
  }
  if (collection.name === 'Typography') {
    return variable.name.endsWith('/Size') || variable.name.includes('/Size ')
  }
  return (variable.scopes ?? []).some((scope) =>
    ['GAP', 'CORNER_RADIUS', 'WIDTH_HEIGHT', 'FONT_SIZE', 'WIDTH', 'HEIGHT', 'STROKE_WEIGHT'].includes(scope),
  )
}
const colorValue = (value) => {
  const [red, green, blue] = ['r', 'g', 'b'].map((key) =>
    Math.round(value[key] * 255),
  )
  const alpha = value.a ?? 1
  if (alpha >= 1) {
    return `#${[red, green, blue]
      .map((channel) => channel.toString(16).padStart(2, '0'))
      .join('')}`
  }
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
const cssValuesMatch = (actual, expected) => {
  if (actual === expected) return true
  const rgba = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([^)]+)\)$/
  const actualColor = actual?.match(rgba)
  const expectedColor = expected?.match(rgba)
  return Boolean(
    actualColor &&
      expectedColor &&
      actualColor.slice(1, 4).every((channel, index) => channel === expectedColor[index + 1]) &&
      Number(actualColor[4]) === Number(expectedColor[4]),
  )
}

let data
let css

try {
  ;[data, css] = await Promise.all([
    readFile(jsonPath, 'utf8').then(JSON.parse),
    readFile(cssPath, 'utf8'),
  ])
} catch (error) {
  console.error(`Unable to read generated token files: ${error.message}`)
  process.exit(1)
}

if (data.source?.fileKey !== '4bMfNqCkX6zywD94itcIgo') {
  fail('Token snapshot does not identify the expected TGG-DS Figma file.')
}

const collections = data.collections
if (!Array.isArray(collections)) {
  fail('Token snapshot is missing its collections array.')
} else {
  const collectionNames = new Set()
  const variablesById = new Map()
  const propertiesByName = new Map()
  const expectedAliases = []

  for (const collection of collections) {
    if (collectionNames.has(collection.name)) {
      fail(`Duplicate collection name: ${collection.name}`)
    }
    collectionNames.add(collection.name)

    const modeIds = new Set(collection.modes?.map((mode) => mode.modeId) ?? [])
    if (!modeIds.has(collection.defaultModeId)) {
      fail(`${collection.name}: default mode ID is absent from its modes.`)
    }

    for (const variable of collection.variables ?? []) {
      if (variablesById.has(variable.id)) {
        fail(`Duplicate Figma variable ID: ${variable.id}`)
      }
      variablesById.set(variable.id, { collection, variable })

      const property = propertyName(collection.name, variable.name)
      const existing = propertiesByName.get(property)
      if (existing) {
        fail(
          `CSS property collision: ${existing.collection}/${existing.variable} and ${collection.name}/${variable.name} both map to ${property}.`,
        )
      } else {
        propertiesByName.set(property, { collection, variable })
      }

      const actualModeIds = Object.keys(variable.valuesByMode ?? {})
      for (const modeId of modeIds) {
        if (!actualModeIds.includes(modeId)) {
          fail(`${variable.id}: missing value for mode ${modeId}.`)
        }
      }
      for (const modeId of actualModeIds) {
        if (!modeIds.has(modeId)) {
          fail(`${variable.id}: value uses unknown mode ${modeId}.`)
        }

        const value = variable.valuesByMode[modeId]
        if (value?.type === 'VARIABLE_ALIAS') {
          expectedAliases.push({
            fromVariableId: variable.id,
            modeId,
            targetVariableId: value.id,
          })
        }
      }
    }
  }

  const variableCount = variablesById.size
  if (variableCount !== expectedVariableCount) {
    fail(`Expected ${expectedVariableCount} variables; found ${variableCount}.`)
  }
  if (data.generatedFrom?.variableCount !== variableCount) {
    fail('generatedFrom.variableCount does not match the exported variables.')
  }

  const externalTargets = new Map(
    (data.externalAliasTargets ?? []).map((target) => [target.id, target]),
  )
  const aliasRecords = data.aliasReferences ?? []
  const recordKeys = new Set()

  for (const alias of aliasRecords) {
    const key = `${alias.fromVariableId}|${alias.modeId}|${alias.targetVariableId}`
    if (recordKeys.has(key)) {
      fail(`Duplicate alias record: ${key}`)
    }
    recordKeys.add(key)

    const source = variablesById.get(alias.fromVariableId)
    if (!source) {
      fail(`Alias source variable is missing: ${alias.fromVariableId}`)
      continue
    }

    const target = variablesById.get(alias.targetVariableId)
    const external = externalTargets.get(alias.targetVariableId)
    if (!target && !external) {
      fail(
        `Broken alias ${source.variable.name} (${alias.modeName}) → ${alias.targetVariableId}.`,
      )
    }
    if (alias.targetStatus === 'unresolved') {
      fail(`Alias is marked unresolved: ${key}`)
    }
    if (target && alias.targetStatus !== 'local') {
      fail(`Alias target status is incorrect for local target ${alias.targetVariableId}.`)
    }
    if (external && alias.targetStatus !== 'resolved-outside-local-inventory') {
      fail(`Alias target status is incorrect for external target ${alias.targetVariableId}.`)
    }
  }

  const expectedKeys = new Set(
    expectedAliases.map(
      (alias) =>
        `${alias.fromVariableId}|${alias.modeId}|${alias.targetVariableId}`,
    ),
  )
  for (const key of expectedKeys) {
    if (!recordKeys.has(key)) fail(`Alias reference is absent from aliasReferences: ${key}`)
  }
  for (const key of recordKeys) {
    if (!expectedKeys.has(key)) fail(`Stale aliasReferences entry: ${key}`)
  }

  if (expectedAliases.length !== expectedAliasReferenceCount) {
    fail(
      `Expected ${expectedAliasReferenceCount} alias references in variable values; found ${expectedAliases.length}.`,
    )
  }
  if (aliasRecords.length !== expectedAliases.length) {
    fail(
      `Expected ${expectedAliases.length} alias records; found ${aliasRecords.length}.`,
    )
  }

  const colorCollection = collections.find((collection) => collection.name === 'Color')
  const responsiveCollection = collections.find(
    (collection) => collection.name === 'Responsive',
  )
  const modeNames = (collection) =>
    collection?.modes?.map((mode) => mode.name) ?? []

  for (const mode of expectedColorModes) {
    if (!modeNames(colorCollection).includes(mode)) {
      fail(`Color collection is missing the ${mode} mode.`)
    }
  }
  for (const mode of expectedResponsiveModes) {
    if (!modeNames(responsiveCollection).includes(mode)) {
      fail(`Responsive collection is missing the ${mode} mode.`)
    }
  }

  const knownDiscrepancy = data.validation?.subheadingTypography
  if (!knownDiscrepancy) {
    fail('Known Subheading typography discrepancy is not documented.')
  } else {
    const sourceVariable = variablesById.get(knownDiscrepancy.variableId)?.variable
    const weightAlias = sourceVariable?.valuesByMode?.['58:0']
    if (
      sourceVariable?.name !== 'Subheading/Font Weight' ||
      weightAlias?.type !== 'VARIABLE_ALIAS' ||
      weightAlias.id !== 'VariableID:9:11182'
    ) {
      fail('Subheading typography variable no longer matches its discrepancy record.')
    }

    const textStyle = data.styles?.textStyles?.find(
      (style) => style.name === knownDiscrepancy.textStyleName,
    )
    if (
      !textStyle ||
      textStyle.fontName?.family !== 'DM Sans' ||
      textStyle.fontName?.style !== 'SemiBold'
    ) {
      fail('Subheading text-style value no longer matches its discrepancy record.')
    }
    warnings.push(
      'Subheading variable (Light/300) conflicts with the Figma text style (DM Sans SemiBold/600); both source values are preserved.',
    )
  }

  const unresolvedCount = expectedAliases.filter(
    (alias) =>
      !variablesById.has(alias.targetVariableId) &&
      !externalTargets.has(alias.targetVariableId),
  ).length
  if (data.validation?.unresolvedAliasReferenceCount !== unresolvedCount) {
    fail('Recorded unresolved alias count does not match alias resolution.')
  }
}

const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
let depth = 0
for (const character of cssWithoutComments) {
  if (character === '{') depth += 1
  if (character === '}') depth -= 1
  if (depth < 0) break
}
if (depth !== 0) fail('Generated CSS has unbalanced braces.')

const blocks = new Map()
for (const match of cssWithoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = match[1].trim()
  const declarations = blocks.get(selector) ?? new Map()
  for (const declaration of match[2].split(';')) {
    const parsed = declaration.trim().match(/^(--[\w-]+)\s*:\s*([\s\S]+)$/)
    if (parsed) declarations.set(parsed[1], parsed[2].trim())
  }
  blocks.set(selector, declarations)
}

const allDefinedProperties = new Set()
for (const declarations of blocks.values()) {
  for (const name of declarations.keys()) allDefinedProperties.add(name)
}
for (const match of cssWithoutComments.matchAll(/var\(\s*(--[\w-]+)/g)) {
  if (!allDefinedProperties.has(match[1])) {
    fail(`CSS references an undefined custom property: ${match[1]}`)
  }
}

const root = blocks.get(':root')
if (!root) fail('Generated CSS is missing the :root token block.')
if (collections) {
  const localById = new Map(
    collections.flatMap((collection) =>
      collection.variables.map((variable) => [
        variable.id,
        { collection, variable },
      ]),
    ),
  )
  const externalById = new Map(
    (data.externalAliasTargets ?? []).map((target) => [
      target.id,
      {
        collection: { name: target.collectionName, modes: [] },
        variable: target,
      },
    ]),
  )
  const valueForCss = (collection, variable, modeId) => {
    const value = variable.valuesByMode[modeId]
    if (value?.type === 'VARIABLE_ALIAS') {
      const target = localById.get(value.id) ?? externalById.get(value.id)
      if (!target) return null
      const targetIsDimension = isDimension(
        target.collection,
        target.variable,
      )
      const reference = `var(${propertyName(target.collection.name, target.variable.name)})`
      return isDimension(collection, variable) && !targetIsDimension
        ? `calc(${reference} * 1px)`
        : reference
    }
    if (variable.type === 'COLOR' && value && 'r' in value) {
      return colorValue(value)
    }
    if (variable.type === 'FLOAT') {
      return isDimension(collection, variable) ? `${value}px` : String(value)
    }
    if (variable.type === 'STRING') return JSON.stringify(value)
    return JSON.stringify(value)
  }

  for (const collection of collections) {
    for (const variable of collection.variables ?? []) {
      const name = propertyName(collection.name, variable.name)
      if (!root?.has(name)) {
        fail(`Generated CSS is missing the default token property ${name}.`)
        continue
      }
      const expected = valueForCss(
        collection,
        variable,
        collection.defaultModeId,
      )
      if (expected !== null && !cssValuesMatch(root.get(name), expected)) {
        fail(
          `${collection.name}/${variable.name}: default CSS value "${root.get(name)}" does not match Figma-derived "${expected}".`,
        )
      }
      if (!css.includes(variable.id)) {
        fail(`Original Figma variable ID is missing from CSS: ${variable.id}`)
      }
    }
  }

  const colors = collections.find((collection) => collection.name === 'Color')
  for (const [mode, selector] of [
    ['SDS Light', '[data-tgg-theme="light"]'],
    ['SDS Dark', '[data-tgg-theme="dark"]'],
  ]) {
    const declarations = blocks.get(selector)
    if (!declarations) {
      fail(`Generated CSS is missing theme selector ${selector}.`)
      continue
    }
    for (const variable of colors?.variables ?? []) {
      const name = propertyName(colors.name, variable.name)
      if (!declarations.has(name)) {
        fail(`${selector} is missing ${name}.`)
      }
      const modeId = colors.modes.find((item) => item.name === mode)?.modeId
      if (!Object.hasOwn(variable.valuesByMode ?? {}, modeId)) {
        fail(`${variable.id} is missing its ${mode} source value.`)
      } else {
        const expected = valueForCss(colors, variable, modeId)
        if (expected !== null && !cssValuesMatch(declarations.get(name), expected)) {
          fail(
            `${mode} ${variable.name}: CSS value "${declarations.get(name)}" does not match Figma-derived "${expected}".`,
          )
        }
      }
    }
  }

  const responsive = collections.find(
    (collection) => collection.name === 'Responsive',
  )
  for (const mode of responsive?.modes ?? []) {
    const selector = `[data-tgg-responsive="${slug(mode.name)}"]`
    const declarations = blocks.get(selector)
    if (!declarations) {
      fail(`Generated CSS is missing responsive selector ${selector}.`)
      continue
    }
    for (const variable of responsive.variables ?? []) {
      const name = propertyName(responsive.name, variable.name)
      if (!declarations.has(name)) {
        fail(`${selector} is missing ${variable.name}.`)
        continue
      }
      const expected = valueForCss(
        responsive,
        variable,
        mode.modeId,
      )
      if (expected !== null && !cssValuesMatch(declarations.get(name), expected)) {
        fail(
          `${mode.name} ${variable.name}: CSS value "${declarations.get(name)}" does not match Figma-derived "${expected}".`,
        )
      }
    }
  }
}

if (errors.length) {
  console.error(`Design token validation failed (${errors.length} error(s)):`)
  for (const error of errors) console.error(`- ${error}`)
  for (const warning of warnings) console.warn(`Warning: ${warning}`)
  process.exit(1)
}

console.log(
  `Design token validation passed: ${data.generatedFrom.variableCount} variables, ${data.aliasReferences.length} aliases, ${data.externalAliasTargets.length} external dependencies.`,
)
console.log('Color modes: SDS Light, SDS Dark.')
console.log('Responsive modes: Desktop, Mobile, Tablet, Desktop Wide.')
for (const warning of warnings) console.warn(`Warning: ${warning}`)
