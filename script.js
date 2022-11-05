document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("search-form")

  //function for displaying user's repositories
  const displayRepos = (url) => {
    fetch(url)
    .then(response => response.json())
    .then(response => {
      const repos_ul = document.getElementById("repo-items")
      repos_ul.innerHTML=""
      response.forEach(repo => {
        list_item = document.createElement("li")
        list_item.innerHTML = repo.name
        repos_ul.appendChild(list_item)
      })
    })
  }
 
  form.onsubmit = function(event) {
    const query = document.getElementById("search-input").value
    event.preventDefault()
    fetch(`https://api.github.com/users/${query}`)
    .then(response => {
      if (!response.ok){
        document.getElementsByClassName("details-box default")[0].style.display = "block"
        document.getElementsByClassName("details-box result-box")[0].style.display = "none"
        document.getElementById("error").textContent = response.status == 404 ? "User not found" : "Sorry, an error occurred. Please try again."
        throw Error(`${response.status}: ${response.statusText}`)
      }
      return response.json()
      })
    .then(response => {
      const formattedDate = new Date(response.created_at).toLocaleString("en-US", {
        weekday: "short",
        month: "long",
        day: "2-digit",
        year: "numeric",
      })
      // clear default info-box
      document.getElementsByClassName("details-box default")[0].style.display = "none"
      // fill data into html elements
      document.getElementById("username").textContent = response.login
      document.getElementById("avatar").src = response.avatar_url
      document.getElementById("username").textContent = response.name ? response.name : "N/A"
      document.getElementById("twitterhandle").textContent = response.twitter_username ? `@${response.twitter_username}` : "N/A"
      document.getElementById("location").textContent = response.location ? response.location : "N/A"
      document.getElementById("creation-date").textContent = formattedDate
      document.getElementById("profile-link").href = response.html_url
      document.getElementById("bio").textContent = response.bio ? response.bio : "No bio available"
      document.getElementById("followers-count").textContent = response.followers
      document.getElementById("following-count").textContent = response.following
      document.getElementById("public-repos-count").textContent = response.public_repos
      displayRepos(response.repos_url)
      // show results box
      document.getElementsByClassName("details-box result-box")[0].style.display = "flex"
      
    })
    .catch(error =>console.log(error))
  }
});