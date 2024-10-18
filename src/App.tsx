import './App.css'
import { useQuery, useMutation } from "@tanstack/react-query";

const posts = [
  { id: 1, title: "Getting Started with React" },
  { id: 2, title: "Mastering JavaScript in 2024" },
  { id: 3, title: "Understanding Vite: A Beginner's Guide" },
  { id: 4, title: "How to Build Fast Apps with Vite and React" },
];

function App() {
  console.log(posts);
  const postsQuery = useQuery(
    {
      queryKey: ["posts"],
      queryFn: () => wait(1000).then(() => [...posts])
    }
  )

  const mutationQuery = useMutation({
    mutationFn: (title: string) => {
      return wait(1000).then(() => posts.push({ id: parseInt(crypto.randomUUID()), title })
      )
    },
  });

  console.log(postsQuery);

  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

  return (
    <div>{postsQuery.data?.map((post) => (
      <div key={post.id}>{post.title}</div>
    ))}
      <button type="button" onClick={() => mutationQuery.mutate("prova 2")}>click</button>
    </div>
  )
}

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export default App
