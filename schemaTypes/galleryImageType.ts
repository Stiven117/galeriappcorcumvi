import {defineField, defineType} from 'sanity'

export const galleryImageType = defineType({
  name: 'galleryImage',
  title: 'Imagen de Galería',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Un título corto para el boletín o la imagen.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'El contenido completo del boletín (hasta 256 caracteres o más).',
      rows: 5, // Hace el campo de texto más alto en el editor
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true, // Permite re-encuadrar la imagen fácilmente
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
          description: 'Describe la imagen. Importante para accesibilidad y SEO.',
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'meetingDate',
      title: 'Fecha de la Reunión',
      type: 'date',
      options: {
        // El formato YYYY-MM-DD es estándar y ayuda a ordenar correctamente
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  // Ordena las imágenes por fecha, de más nueva a más antigua
  orderings: [
    {
      title: 'Fecha de Reunión, Recientes primero',
      name: 'meetingDateDesc',
      by: [{field: 'meetingDate', direction: 'desc'}],
    },
  ],
  // Configura la vista previa en el Sanity Studio
  preview: {
    select: {
      title: 'title',
      date: 'meetingDate',
      media: 'image',
    },
    prepare({title, date, media}) {
      let dateString = 'Sin fecha'
      if (date) {
        // El formato de fecha de Sanity es 'YYYY-MM-DD'.
        // Dividir la cadena y construir el objeto de fecha asegura que no haya problemas de zona horaria en la interpretación.
        const [year, month, day] = date.split('-').map(Number)
        // El mes en el constructor de Date es 0-indexado (0 para Enero), por eso restamos 1.
        const utcDate = new Date(Date.UTC(year, month - 1, day))
        dateString = utcDate.toLocaleDateString('es-CO', {timeZone: 'UTC'})
      }
      return {
        title,
        subtitle: dateString,
        media,
      };
    },
  },
});
