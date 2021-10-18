console.log("hola");

const candidateArr = [];

class CandidateBackgroundScript {
    
  constructor ( fullName, overallRating, candidateReview ) {
  
  this.fullName = fullName;
  this.overallRating = overallRating;
  this.candidateReview = candidateReview;

  }
}

candidate = new CandidateBackgroundScript ("Na",0,"Na");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.htmlSender === "Init") {
      sendResponse(candidate);
    }else if (request.htmlSender === "Name"){
      candidate.fullName = request.message;
      sendResponse("Saved succesfully");
      console.log(candidate);
    } else if (request.htmlSender === "Rating") {
      candidate.overallRating = request.message;
      sendResponse("Saved succesfully");
      console.log(candidate);  
    } else if (request.htmlSender === "Comment") {
      candidate.candidateReview = request.message;
      console.log(candidate);
      sendResponse("Saved succesfully");
    } else if (request.htmlSender === "Erase") {
      candidate.fullName = "Na";
      candidate.overallRating = 0;
      candidate.candidateReview = "Na";
      sendResponse("Erased succesfully");
    } else {
      sendResponse("Error: message not saved");
    }   
  }
);