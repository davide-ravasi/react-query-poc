import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { createPost } from "./api/posts";
import Post from "./Post";

export function CreatePost({ setCurrentPage }) {
  const titleRef = useRef();
  const bodyRef = useRef();
  const queryClient = useQueryClient();
  // mutation don't retry by default
  // to avoid create the same post multiple times
  const createPostMutation = useMutation({
    // all vars are passed directly to the function
    mutationFn: createPost,
    // parameters we can pass are:
    // (data, variables, context)
    onSuccess: (data) => {
      queryClient.setQueryData(["posts", data.id], data);
      // useful to invalidate immediately the query
      // and to refresh the list
      // exact: true to invalidate the query with this key exactly
      queryClient.invalidateQueries(["posts"], { exact: true });
      setCurrentPage(<Post id={data.id} />);
    },
    //onError: (error, variables, context) => {}
    // this is like finally in promises
    //onSettled: (data, error, variables, context) => {}
    // executed before the mutationFn
    // useful for example to pass something in a context or to do something before mutation executes
    onMutate: (variables) => {
      return { hi: "hi" };
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createPostMutation.mutate({
      title: titleRef.current.value,
      body: bodyRef.current.value,
    });
  }

  return (
    <div>
      {createPostMutation.isError && JSON.stringify(createPostMutation.error)}
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" ref={titleRef} />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <input id="body" ref={bodyRef} />
        </div>
        <button disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </div>
  );
}
