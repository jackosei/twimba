import { generateRandomDate } from "./utilities.js";

// localStorage utility functions
const STORAGE_KEY = 'twimba-app-data-v1';
const EXPIRY_HOURS = 1;

export function saveToLocalStorage(tweetsData) {
    try {
        const dataToSave = {
            expiry: Date.now() + (EXPIRY_HOURS * 60 * 60 * 1000),
            userTweets: tweetsData.filter(tweet => tweet.handle === '@Scrimba').map(tweet => ({
                ...tweet,
            })),
            interactions: tweetsData
                .filter(tweet => tweet.handle !== '@Scrimba').map(tweet => ({
                    uuid: tweet.uuid,
                    isLiked: tweet.isLiked,
                    isRetweeted: tweet.isRetweeted,
                    likes: tweet.likes,
                    retweets: tweet.retweets
                })),
            timestamps: tweetsData.reduce((acc, tweet) => {
                if (tweet.timestamp) {
                    acc[tweet.uuid] = tweet.timestamp;
                }
                return acc;
            }, {})
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;

        const parsedData = JSON.parse(saved)

        // Check if data has expired
        if (parsedData.expiry && Date.now() > parsedData.expiry) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return parsedData;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
    }
}

export function initializeData(tweetsData) {
    const saved = loadFromLocalStorage();

    if (saved && saved.timestamps) {
        // Restore timestamps from saved data
        tweetsData.forEach(function (tweet) {
            if (saved.timestamps[tweet.uuid]) {
                tweet.timestamp = saved.timestamps[tweet.uuid];
            } else if (!tweet.timestamp) {
                // Generate new timestamp only if not in saved data and not already set
                tweet.timestamp = generateRandomDate().getTime();
            }
        });

        // Restore interactions on seed tweets
        if (saved.interactions) {
            saved.interactions.forEach(savedInteraction => {
                const tweet = tweetsData.find(t => t.uuid === savedInteraction.uuid);
                if (tweet) {
                    tweet.isLiked = savedInteraction.isLiked;
                    tweet.isRetweeted = savedInteraction.isRetweeted;
                    tweet.likes = savedInteraction.likes;
                    tweet.retweets = savedInteraction.retweets;
                }
            });
        }

        // Prepend user-created tweets (they already have timestamps)
        tweetsData.unshift(...saved.userTweets);
    } else {
        // First time load - generate timestamps for seed tweets
        tweetsData.forEach(function(tweet) {
            if (!tweet.timestamp) {
                tweet.timestamp = generateRandomDate().getTime();
            }
        });
    }
}