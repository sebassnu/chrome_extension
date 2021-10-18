const bodyHtml = document.body;
let candidate;
let overallRating, fullName, candidateReview;
let divLogo, divLogIn, divForm, buttonRatingAdd, buttonRatingSubstract, htmlOverallRating, buttonSubmitHtml, commentHtml, fullNameHtml;

class Candidate {
    
    constructor ( fullName, overallRating, candidateReview ) {
    
    this.fullName = fullName;
    this.overallRating = overallRating;
    this.candidateReview = candidateReview;

    const day = new Date();
    const months = day.getMonth() + 1;
    this.date = day.getFullYear() + "-" + months + "-" + day.getDate() ;

    }
}


const init = () => {



    const htmlLogo = `
        <img src="./assets/hiro-logo.png">
        <hr>    
    `;

    // Create html elements for logo
    divLogo = document.createElement('div');
    divLogo.className = "text-center mt-3";
    divLogo.innerHTML = htmlLogo;

    // Append
    bodyHtml.append(divLogo);
    bodyHtml.style.width = "400px";

      // create form
        const formHtml = `
            <div class="mb-3 mt-3">
                <label for="Full name" class="form-label">Candidate${"&#39"}s full name:</label>
                <input type="text" class="form-control" id="Full name" placeholder="Enter candidate${"&#39"}s full name" name="Full name">
            </div>  
            <div class="mb-3">
                <label for="rating">Overall rating:</label>
                <div class="container">
                <div class="row align-items-start">    
                    <div class="btn-group col-3">
                        <button type="button" class="btn btn-primary" id="substracRating">-</button>    
                        <button type="button" class="btn btn-primary" id="addRating">+</button>
                        
                    </div>    
                    <div class="col">
                        <label id="Overall rating">0</lable>
                    </div>
                    <div class="col">
                        
                    </div>
                </div>
                </div>
            </div>
            <div class="mb-3">
            <label for="comment">Comments:</label>
            <textarea class="form-control" rows="5" id="comment" placeholder="Enter candidate${"&#39"}s interview review" name="text"></textarea>
            </div>
            <button class="btn btn-primary mb-3" id="buttonSubmitHtml">Download as text file</button>`;

        // create html
        
        divForm = document.createElement('div');
        divForm.className = "mt-2 ms-2 px-2";
        divForm.innerHTML = formHtml;
        bodyHtml.append(divForm);

        
        // link html to js

        fullNameHtml = document.getElementById("Full name");
        buttonRatingAdd = document.getElementById("addRating");
        buttonRatingSubstract = document.getElementById("substracRating");
        htmlOverallRating = document.getElementById("Overall rating");
        commentHtml = document.getElementById("comment");
        buttonSubmitHtml = document.getElementById("buttonSubmitHtml");

        overallRating = 0;
        console.log("done");

        //check previous info

        chrome.runtime.sendMessage({htmlSender: "Init" , message: "" }, function(response) {
            console.log("background file checked");
            if (response.fullName !== "Na") {
                fullNameHtml.value = response.fullName;
            } 
            if (response.overallRating !== 0) {
                htmlOverallRating.innerHTML = response.overallRating;
                overallRating = response.overallRating;
            }
            if (response.candidateReview !== "Na") {
                commentHtml.value = response.candidateReview;
            }
             console.log(response);
          });

        // rating buttons add
        
        buttonRatingAdd.addEventListener("click", () => {

            if ( overallRating < 3 ) {

                overallRating++;
                htmlOverallRating.innerHTML = overallRating;
                buttonRatingSubstract.disabled = false;

                //Message to background.js

                sendMessage("Rating",overallRating);

                if (overallRating === 3) {
                    buttonRatingAdd.disabled = true;
                }  
            }

        });

        // rating buttons substract
        
        buttonRatingSubstract.addEventListener("click", () => {

            if ( overallRating > 1 ) { 

                overallRating--;
                htmlOverallRating.innerHTML = overallRating;
                buttonRatingAdd.disabled = false;

                //Message to background.js

                sendMessage("Rating",overallRating);


                if (overallRating === 1) {
                    buttonRatingSubstract.disabled = true;
                }  
            }

        });

        //     

        //fullName change

        fullNameHtml.addEventListener("keyup", () => {
            sendMessage("Name",fullNameHtml.value);
        });

        // // Comments change

        commentHtml.addEventListener("keyup", () => {
            sendMessage("Comment",commentHtml.value);
        });

        // button submission

        buttonSubmitHtml.addEventListener("click", () => {

            
            candidate = new Candidate(fullNameHtml.value,overallRating,commentHtml.value);

            const txtFile = document.createElement("a");
            txtFile.download = `${candidate.date}-${candidate.fullName}`;

            const  blob = new Blob ([`\n${candidate.fullName} rating: \n\n${candidate.overallRating} stars\n\n\nCandidate review: \n\n${candidate.candidateReview}`], {
                type: "text/plain"
            });

            txtFile.href = window.URL.createObjectURL(blob);
            txtFile.click();
            
            //restart
            chrome.runtime.sendMessage({htmlSender: "Erase" , message: "" }, function(response) {
                console.log(response);
                if (response)
                bodyHtml.removeChild(divLogo);
                bodyHtml.removeChild(divForm);
                init();
              });         
              
            
        });

}

const sendMessage = (sender,message) => {
    chrome.runtime.sendMessage({htmlSender: sender , message: message }, function(response) {
        console.log(response);
      });

}

init();
