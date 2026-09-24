interface SetGuideProps {
  heading: string
  items: { question: string; answer: string }[]
}

export default function SetGuide({ heading, items }: SetGuideProps) {
  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">{heading}</h2>
      <div className="mt-6 max-w-2xl space-y-6">
        {items.map((item) => (
          <div key={item.question} className="space-y-2">
            <h3 className="font-display text-base font-semibold">{item.question}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
