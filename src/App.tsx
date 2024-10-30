import './App.css'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const posts = [
  { id: 1, title: "Getting Started with React" },
  { id: 2, title: "Mastering JavaScript in 2024" },
  { id: 3, title: "Understanding Vite: A Beginner's Guide" },
  { id: 4, title: "How to Build Fast Apps with Vite and React" },
];

function App() {
  const queryClient = useQueryClient();

  // how to create the query key for this kinds of endpoint?
  // /posts -> ["posts"]
  // /posts/1 -> ["posts", post.id]
  // /posts?authorId=1 -> ["posts", { authorId: 1 }]
  // /posts/2/comments -> ["posts", post.id, "comments"]
  // the key has to be unique for this query
  const postsQuery = useQuery(
    {
      queryKey: ["posts"],
      queryFn: (obj) => {
        // the query obj returns a set of value useful as a queryKey, 
        // - the queryKey // it's important because you can have all info you pass as parameters (see example before)
        //                   in the queryKey we have all the parameters sended
        // - meta 
        // - signal 
        // in this function we also have .error object that is super important to have all errors related to the call - fetch method doesn't manage all the errors, we have to add it manually
        console.log("ob", obj);

        return wait(1000).then(() => [...posts])
      }
    }
  )

  // this is to create mutations --> change somthing in the db :)
  const mutationQuery = useMutation({
    mutationFn: (title: string) => {
      return wait(1000).then(() => posts.push({ id: parseInt(crypto.randomUUID()), title })
      )
    },
    onSuccess: () => queryClient.invalidateQueries(["posts"])
  });

  console.log(postsQuery);

  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

  return (
    <div>{postsQuery.data?.map((post) => (
      <div key={post.id}>{post.title}</div>
    ))}
      <button disabled={mutationQuery.isPending} type="button" onClick={() => mutationQuery.mutate("prova 2")}>click</button>
    </div>
  )
}

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export default App
