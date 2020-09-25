const options = {
  runtimeHelpers: true,
  cjs: { type: 'babel', lazy: true },
  cssModules: false, // https://github.com/umijs/father/issues/131
  lessInBabelMode: true,
};

export default options;
