export function useScrollTo() {
  return (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}
