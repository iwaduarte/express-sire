const { cli } = require('../../cli');

describe('index.js - parseArgs', () => {
  test('FLAGS "-n name -a"', async () => {
    const argv = ['node', 'jest', '--name', 'test', '-a'];
    const mostlyDefaultsToTrue = {
      projectName: 'test',
      monorepo: true,
      moduleSystem: 'cjs',
      compression: true,
      helmet: true,
      sequelize: true,
      git: [true, true]
    };
    expect(cli(argv)).toEqual(mostlyDefaultsToTrue);
  });
  test('if no "-n/--name" FLAG returns false', async () => {
    const argv = ['node', 'jest', '-a', '-ms', 'test'];
    expect(cli(argv)).toBe(false);
  });
  test('FLAG "-name" only', () => {
    const mostlyDefaultsToFalse = {
      projectName: 'test',
      monorepo: false,
      moduleSystem: 'cjs',
      compression: false,
      helmet: false,
      sequelize: false,
      git: [false, false]
    };
    const argv = ['node', 'jest', '--name', 'test'];
    expect(cli(argv)).toEqual(mostlyDefaultsToFalse);
  });
});
