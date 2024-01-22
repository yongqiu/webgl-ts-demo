declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '@src/webgl-utils.js'