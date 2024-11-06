import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { getPost } from "./api/posts"
import { CreatePost } from "./CreatePost"
import Post from "./Post"
import { PostListInfinite } from "./PostListInfinite"
import { PostListPaginated } from "./PostListPaginated"
import PostsList1 from "./PostsList1"
import PostsList2 from "./PostsList2"

export default function App() {
  const [currentPage, setCurrentPage] = useState(<PostsList1 />)
  const queryClient = useQueryClient()

  function onHoverPostOneLink() {
    queryClient.prefetchQuery({
      queryKey: ["posts", 1],
      queryFn: () => getPost(1),
    })
  }

  return (
    <div>
      <button onClick={() => setCurrentPage(<PostsList1 />)}>
        Posts List 1
      </button>
      <button onClick={() => setCurrentPage(<PostsList2 />)}>
        Posts List 2
      </button>
      <button
        onMouseEnter={onHoverPostOneLink}
        onClick={() => setCurrentPage(<Post id={1} />)}
      >
        First Post
      </button>
      <button
        onClick={() =>
          setCurrentPage(<CreatePost setCurrentPage={setCurrentPage} />)
        }
      >
        New Post
      </button>
      <button onClick={() => setCurrentPage(<PostListPaginated />)}>
        Post List Paginated
      </button>
      <button onClick={() => setCurrentPage(<PostListInfinite />)}>
        Post List Infinite
      </button>
      <br />
      {currentPage}
    </div>
  )
}


// how to create the query key for this kinds of endpoint?
// /posts -> ["posts"]
// /posts/1 -> ["posts", post.id]
// /posts?authorId=1 -> ["posts", { authorId: 1 }]
// /posts/2/comments -> ["posts", post.id, "comments"]
// the key has to be unique for this query

// the query obj returns a set of useful value,
// - the queryKey // it's important because you can have all info you pass as
//   parameters (see example before)
// in the queryKey we have all the parameters sended
// - meta
// - signal
// in this function we also have .error object that is super important to have all errors related to the call - fetch method doesn't manage all the errors, we have to add it manually

//queryFn: () => Promise.reject("Error message"),

/*
IMPORTANT DEFAULTS ---------------------------------------------
- By default, "inactive" queries are garbage collected after 5 minutes.
- Queries that fail are silently retried 3 times, with exponential backoff delay before 
  capturing and displaying an error to the UI.
- Query results by default are structurally shared to detect if data has actually changed and  
  if not, the data reference remains unchanged to better help with value stabilization with regards to useMemo and useCallback.
*/


/*
USE QUERY KEY - how it works
- 

STATUS AND FETCH STATUS
The status of the query.
Will be:
pending if there's no cached data and no query attempt was finished yet.
error if the query attempt resulted in an error.
success if the query has received a response with no errors and is ready to display its data. The status of the query.

The fetch status of the query.
fetching: Is true whenever the queryFn is executing, which includes initial pending as well as background refetch.
paused: The query wanted to fetch, but has been paused.
idle: The query is not fetching.
See Network Mode for more information.

REACT QUERY VS AXIOS OR FETCH

Automatic Caching:
- React Query automatically caches data from API calls and keeps it in sync with your components. 
- Axios doesn’t do this by default; it just makes HTTP requests and returns data.
Cached data in React Query can be reused across components, reducing unnecessary network requests and improving app performance.

Background Refetching:
- React Query can automatically refetch data in the background when a component mounts, after a specified interval, or when it detects a network reconnect. This keeps data up-to-date without requiring manual setup.
- With Axios, you would need to write custom code to handle refetching behavior.

Data Synchronization:
- React Query includes functionality to track data states like loading, error, and success, and it keeps components in sync with these states automatically.
- It’s more work to manage these states manually with Axios, especially as your app grows.

Automatic Retry and Error Handling:
- React Query allows you to set up automatic retries for failed requests, helping to handle transient errors without extra code.
- While Axios can retry requests, it requires additional setup to handle retries and errors in a way that’s cohesive with the rest of the React app.

Optimistic Updates and Mutations:
- React Query simplifies optimistic updates, where data is updated in the UI immediately and the server is updated afterward. It rolls back the update if the server update fails.
- Axios doesn’t provide this capability out-of-the-box; you’d need custom logic to handle optimistic updates manually.

Devtools for Easier Debugging:
- React Query has dev tools that allow you to see the state of each query (loading, error, success) and its cached data, making debugging much easier.
- With Axios, you wouldn’t have this level of visibility into request states without adding a lot of custom logging.

*/
