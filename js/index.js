import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

/*
Challenge:
3. We could improve index.js by moving one line
   of code to a better position. Find it and move it!
*/

document.addEventListener("click", function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like);
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet);
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);
    } else if (e.target.id === "tweet-btn") {
        handleTweetBtnClick();
    }
});

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
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById("tweet-input");

    /*
  Challenge:
  1. No empty tweets!
  2. Clear the textarea after tweeting!
  */
    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        });
        render();
        tweetInput.value = "";
    }
}

function getFeedHtml() {
    let feedHtml = ``;

    tweetsData.forEach(function (tweet) {
        let likeIconClass = "";

        if (tweet.isLiked) {
            likeIconClass = "liked";
        }

        let retweetIconClass = "";

        if (tweet.isRetweeted) {
            retweetIconClass = "retweeted";
        }

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

        let attachmentHtml = "";
        if (tweet.hasAttachment && tweet.attachment && tweet.attachment.poll) {
            attachmentHtml = renderPollAttachment(tweet.attachment.poll);
        }

        feedHtml += `
            <div class="tweet section-padding">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div class="tweet-content">
                        <div class="tweet-user-details">
                            <p class="username">Full Name</p>        
                            <p class="handle">${tweet.handle}</p>
                            <i class="fa-solid fa-circle"></i>
                            <span class="tweet-time">
                                ${getRelativeTimeString(generateRandomDate())}
                            </span>
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                        <p class="tweet-text">${formatHashtags(tweet.tweetText)}</p>
                        ${attachmentHtml}
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
            <div class="poll-option-bar ${'poll-option-' + (index+1)}" style="width: ${option.score}%;"></div>
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
            ${timeLeftLabel
            ? `${timeLeftLabel}`
            : ""
        }
        </div>
    </div>`;
}

function generateRandomDate() {
    // Timestamps in milliseconds
    const now = Date.now()
    const oneMinute = 60 * 1000
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    // Create bounds
    const start = now - sevenDays
    const end = now - oneMinute

    // Generate a random timestamp between start and end
    const randomTimestamp = Math.floor(Math.random() * (end - start) + start)

    // Convert back to a Date object and return
   return new Date(randomTimestamp)
}

function getRelativeTimeString(date) {
    const diffMs = Date.now() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return 'now'
    if (diffMinutes < 60) return `${diffMinutes}m`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d`
}

function render() {
    document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
