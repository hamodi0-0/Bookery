
document.addEventListener("DOMContentLoaded", ()=>{

            const form = document.getElementById('searchForm');
            //preventing form submitting during typing
                  form.addEventListener('submit', async (e) => {
                      e.preventDefault(); 
                   });
                
            const inputBox = document.getElementById('inputBox')
            
            inputBox.addEventListener('input', async ()=>{             
            const text = inputBox.value;

            try {
                const response = await axios.post("/search", { text });
                const suggestions = response.data.suggestions;
                renderSuggestions(suggestions);
              } catch (err) {
                console.error("Failed to fetch suggestions:", err);
              }
            });
            

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
                  author.textContent = item.author_name || "Unknown Author";
              
                  info.appendChild(title);
                  info.appendChild(author);
                  left.appendChild(img);
                  left.appendChild(info);
                  suggestionItem.appendChild(left);
              
                  // Add View button
                  const buttonWrapper = document.createElement("div");
                  const viewButton = document.createElement("button");
                  viewButton.textContent = "View";
                  buttonWrapper.appendChild(viewButton);
                  suggestionItem.appendChild(buttonWrapper);
              
                  container.appendChild(suggestionItem);
                });
              }
              
})

