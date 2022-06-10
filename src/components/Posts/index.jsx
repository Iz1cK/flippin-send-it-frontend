import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    
  }, []);

  const fetchData = () =>{
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setPosts(
      await axios.post(`http://localhost:4000/api/posts/get-all`, {amount:5},axiosConfig)
    );
  }

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        // }
      >
        {posts}
      </InfiniteScroll>
    </>
  );
}
