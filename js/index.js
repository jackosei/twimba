import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initializeData, saveToLocalStorage } from "./dataStorage.js";
import { getRelativeTimeString, compressImage } from "./utilities.js";

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.id === "remove-image") {
    console.log("Remove image");
    removeImageAttachment();
  }
});

document.getElementById("imageInput").addEventListener("change", function () {
  handleImageAttachment();
});

function removeImageAttachment() {
  document.getElementById("preview-img").src = "";
  document.getElementById("tweet-image-preview").classList.add("hidden");
  document.getElementById("imageInput").value = "";
}

function handleImageAttachment() {
  const imageInput = document.getElementById("imageInput");
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById("preview-img");
      img.src = e.target.result;
      document.getElementById("tweet-image-preview").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
}

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
  saveToLocalStorage(tweetsData);
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
  saveToLocalStorage(tweetsData);
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function addTweet(tweetText, imageFile) {
  tweetsData.unshift({
    fullName: "Jack Osei",
    handle: `@Scrimba`,
    profilePic: `images/scrimbalogo.png`,
    likes: 0,
    retweets: 0,
    tweetText: tweetText,
    replies: [],
    hasAttachment: imageFile ? true : false,
    attachment: {
      image: {
        src: imageFile ? URL.createObjectURL(imageFile) : "",
        alt: "",
      },
      video: {
        src: "",
      },
      poll: [],
    },
    isLiked: false,
    isRetweeted: false,
    uuid: uuidv4(),
    timestamp: Date.now() - 60 * 1000,
  });
  render();
  document.getElementById("tweet-input").value = "";
  removeImageAttachment();
  saveToLocalStorage(tweetsData);
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  const imageFile = document.getElementById("imageInput").files[0];

  if (!tweetInput.value) return;

  if (imageFile) {
    compressImage(
      imageFile,
      function (result) {
        addTweet(tweetInput.value, result);
      },
      function (e) {
        console.error(e);
        addTweet(tweetInput.value, imageFile);
      }
    );
  } else {
    addTweet(tweetInput.value, null);
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    const likeIconClass = tweet.isLiked ? "liked" : "";

    const retweetIconClass = tweet.isRetweeted ? "retweeted" : "";

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `;
      });
    }

    const attachmentHtml =
      tweet.hasAttachment && tweet.attachment && tweet.attachment.poll
        ? renderPollAttachment(tweet.attachment.poll)
        : "";

    const attachmentImageHtml =
      tweet.hasAttachment && tweet.attachment && tweet.attachment.image
        ? renderImageAttachment(tweet.attachment.image)
        : "";

    const tweetDate = tweet.timestamp
      ? new Date(tweet.timestamp)
      : generateRandomDate();

    feedHtml += `
            <div class="tweet section-padding">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div class="tweet-content">
                        <div class="tweet-user-details">
                            <p class="username">${tweet.fullName}</p>        
                            <p class="handle">${tweet.handle}</p>
                            <i class="fa-solid fa-circle"></i>
                            <span class="tweet-time">
                                ${getRelativeTimeString(tweetDate)}
                            </span>
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                        <p class="tweet-text">${formatHashtags(
                          tweet.tweetText
                        )}</p>
                        ${attachmentHtml}
                        ${attachmentImageHtml}
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>   
            </div>
            `;
  });
  return feedHtml;
}

function formatHashtags(text) {
  return text.replace(/(#\w+)/g, '<span class="hashtag">$1</span>');
}

function renderPollAttachment(pollData) {
  if (!pollData || !pollData.options || !pollData.options.length) {
    return "";
  }

  const optionsHtml = pollData.options
    .map(function (option, index) {
      return `
        <div class="poll-option">
            <div class="poll-option-bar ${
              "poll-option-" + (index + 1)
            }" style="width: ${option.score}%;"></div>
            <div class="poll-option-content">
                <span class="poll-option-text">${option.content}</span>
                <span class="poll-option-score">${option.score}%</span>
            </div>
        </div>`;
    })
    .join("");

  let timeLeftLabel = "";

  if (pollData.endDate) {
    const now = new Date();
    const endDate = new Date(pollData.endDate);
    const diffMs = endDate.getTime() - now.getTime();
    if (diffMs > 0) {
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      timeLeftLabel = `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`;
    } else if (diffMs <= 0) {
      timeLeftLabel = "Poll Expired";
    }
  }

  return `
    <div class="poll-attachment">
        ${optionsHtml}
        <div class="poll-meta">
            <span class="poll-votes">${pollData.votes.toLocaleString()} votes</span><span>·</span>
            ${timeLeftLabel ? `${timeLeftLabel}` : ""}
        </div>
    </div>`;
}

function renderImageAttachment(image) {
  if (!image.src) {
    return "";
  }
  return `
    <div class="tweet-image">
        <img src="${image.src}" alt="Tweet Image">
    </div>`;
}

let isFirstRender = true;

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();

  // After first render, save timestamps to localStorage
  if (isFirstRender) {
    isFirstRender = false;
    saveToLocalStorage(tweetsData);
  }
}

initializeData(tweetsData);
render();
