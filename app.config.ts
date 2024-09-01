import type { AppConfigInput } from 'nuxt/schema'

export default defineAppConfig({
  awesome: {
    name: 'FFis',
    description:
      'a starter template for Nuxt 3 with minimalist themes design, built in components, drawer & menus, and more.',
    project: {
      links: {
        github: 'https://github.com/viandwi24/nuxt3-awesome-starter',
      },
    },
    layout: {
      page: {
        navbar: {
          menus: [
            {
              type: 'link',
              title: 'References',
              to: { name: 'references' },
            },
            {
              type: 'link',
              title: 'Flights',
              to: { name: 'flights' },
            },
            // { type: 'link', title: 'Post', to: { name: 'post' } },
            { type: 'link', title: 'Airlines', to: { name: 'airlines' } },
            // {
            //   type: 'dropdown',
            //   title: 'Flow',
            //   children: [
            //     {
            //       type: 'link',
            //       title: 'Components',
            //       to: { name: 'docs-components' },
            //     },
            //     {
            //       type: 'link',
            //       title: 'Airlines',
            //       to: { name: 'airlines' },
            //     },
            //   ],
            // },
            { type: 'button', title: 'Setting', to: { name: 'setting' } },
            // dynamic title
            // {
            //   type: 'button',
            //   title: (nuxt) =>
            //     (nuxt._appConfig as AppConfigInput)?.awesome?.name || '',
            //   to: (nuxt) => (nuxt._appConfig as AppConfigInput)?.awesome?.name || '',
            // },
          ],
        },
      },
      footer: {
        year: new Date().getFullYear(),
      },
      welcome: {
        title: 'Nuxt&nbsp;3 Awesome Starter',
        disableInfoReplaceIndexInWelcomePage: true,
      },
    },
    author: {
      name: 'viandwi24',
      links: {
        github: 'https://github.com/viandwi24',
        medium: 'https://viandwi24.medium.com',
        website: 'https://viandwi24.site',
      },
    },
  },
})
