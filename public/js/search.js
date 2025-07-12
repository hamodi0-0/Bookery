
document.addEventListener("DOMContentLoaded", ()=>{

                  //preventing form submitting during typing
                  const form = document.getElementById('searchForm');
                  form.addEventListener('submit', async (e) => {
                      e.preventDefault(); 
                   });
                
                  const inputBox = document.getElementById("inputBox");
                  const debouncedSearch = debounce(handleSearchInput, 300);
                  
                  inputBox.addEventListener("input", debouncedSearch);

                  document.querySelectorAll('.star').forEach(star => {
                    star.addEventListener('click', () => {
                      const rating = parseInt(star.dataset.value);
                      document.querySelectorAll('.star').forEach(s => {
                        s.style.color = parseInt(s.dataset.value) <= rating ? 'gold' : '#ccc';
                      });
                    });
                  });
                  
                  // suggestionsContainer.addEventListener("click", async (e) => {
                  //   if (e.target.classList.contains("viewButton")) {
                  //     const {workId} = e.target.dataset;
                  //     const response = await axios.post("/view", { workId });
                  //   }
                  // });
                  
                                
})

// Functions:

// function to make post request to /search route in backend
    async function handleSearchInput() {
      const text = inputBox.value.trim();

      if(text === ''){   // if input box is empty clear the drop-down list
        setTimeout(() => {
          document.getElementById("suggestions").innerHTML = ""
        }, 1000);
            
      } else {
        try {
          const response = await axios.post("/search", { text });
          renderSuggestions(response.data.suggestions);
        } catch (err) {
          console.error("Error sending request:", err);
        }
      }
      
    }
      
      // function to render suggestions
    function renderSuggestions(suggestions) {
    const container = document.getElementById("suggestions");
    container.innerHTML = ""; // Clear previous suggestions

    suggestions.forEach(item => {
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";

      // Create left section
      const left = document.createElement("div");
      left.className = "suggestion-left";

      const img = document.createElement("img");
      img.src = `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`;

      const info = document.createElement("div");
      info.className = "suggestion-info";

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = item.title;

      const author = document.createElement("div");
      author.className = "author";
      author.textContent = item.author_name[0] || "Unknown Author";

      info.appendChild(title);
      info.appendChild(author);
      left.appendChild(img);
      left.appendChild(info);
      suggestionItem.appendChild(left);

      // Add View button
      const buttonWrapper = document.createElement("div")
      const viewButton = document.createElement("a");
      viewButton.className = "viewButton"
      viewButton.href = `/view?imgSrc=https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg&title=${item.title}&author=${item.author_name}`
      viewButton.textContent = "View";
      buttonWrapper.appendChild(viewButton);
      suggestionItem.appendChild(buttonWrapper);

      container.appendChild(suggestionItem);
    });
    }

      // debounce function
    function debounce(func, delay) {
      let timeoutId;
      return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
    }

    // clearing input function
    const clearSuggestions = debounce(()=>{
      document.getElementById("suggestions").innerHTML = ""
    }, 1000)
    // we use this debounce function so that we wait before clearing the list so it does not get overwritten by late API response 
   