/**
 * javascript-obfuscator post-build configuration.
 * Applied via the obfuscate script, not as a Vite plugin.
 */
export const obfuscationConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.5,
  sourceMap: false,
  sourceMapMode: 'separate',
}
