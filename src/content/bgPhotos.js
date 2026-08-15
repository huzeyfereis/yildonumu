const modules = import.meta.glob('../../public/images/bg/*.{jpg,jpeg,JPG,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const bgPhotos = Object.values(modules)
