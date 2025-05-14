// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';
import unocss from '@unocss/eslint-config/flat';

export default withNuxt(
	{
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
			'import/no-named-as-default': 'off',
			'import/first': 'off',
			'vue/attribute-hyphenation': 0,
			'vue/multi-word-component-names': 0,
		},
	},

	eslintConfigPrettier,

	// @ts-ignore
	// See https://github.com/nuxt/eslint/issues/497
	unocss,
);
