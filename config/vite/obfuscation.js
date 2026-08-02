/**
 * javascript-obfuscator post-build configuration.
 * Applied via a post-build Node script, not as a Vite plugin — which is why
 * this file is plain JS. Node will not strip types under `node_modules`.
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
}
