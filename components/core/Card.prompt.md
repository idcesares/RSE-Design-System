Content card for programs, schools, or news — image, category tag, eyebrow, title, description, footer slot (e.g. a Button or Badge).

```jsx
<Card
  image={<img src="photo.jpg" />}
  tag={<Tag color="green">Educação Infantil</Tag>}
  eyebrow="Rede Sesc"
  title="Colégio Sesc de Ensino Médio"
  description="Formação integral com foco em protagonismo estudantil."
  footer={<Button size="sm" variant="secondary">Saiba mais</Button>}
/>
```

Lifts on hover (shadow + translateY). Use `<image-slot>` as the `image` placeholder in prototypes.
