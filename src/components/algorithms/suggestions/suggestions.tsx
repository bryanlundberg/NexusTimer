import { ALGORITHMS_GITHUB_URL } from '@/constants/algorithms-github-url';

export default function Suggestions() {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6 py-10">
      If you find any errors or want to extend with more algorithms, please submit it on our GitHub: <a
      href={ALGORITHMS_GITHUB_URL}
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >Here</a>.
    </p>
  )
}
