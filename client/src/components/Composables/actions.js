import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { currentUser, getCurrentUser, signout } from "@/service/auth.js";
import { useRouter } from "vue-router";

import AppApiService from "../../service/index";

export function Actions() {
  const service = AppApiService();
  const router = useRouter();


  // now we will add our vote send to our db and the same for the downvote using service

  const upvote = async (itemId) => {
    try {
      await service.upvoteSubmission(itemId);

    } catch (error) {
      console.error(error);
    }
  };

  const downvote = async (itemId) => {
    try {
      await service.downvoteSubmission(itemId);

    } catch (error) {
      console.error(error);
    }
  };

  // Show the full text of the item
  const showFullText = async (itemId) => {
    try {
      // Redirect to the displayPoetry page with the received data
      router.push({
        name: "displayPoetry",
        params: {
          id: itemId, // Include the item ID in the path
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const ShareToTwitter = (item) => {
    const itemType = item.title ? "poem" : "proverb";
    const textToShare = item.title || item.content;
    let tweetText = `Check out this ${itemType}: "${textToShare}"`;

    const viaText = " - via [YourAppName]";
    const websiteLink = "https://www.yourwebsite.com"; // Replace with your actual website URL
    const meaningText = item.meaning ? ` - Meaning: "${item.meaning}"` : "";
    const logoUrl = "https://www.yourwebsite.com/logo.png"; // Replace with the actual URL of your logo
    const potentialTweet =
      tweetText + meaningText + ` [${websiteLink}]` + viaText;

    // Add the logo URL at the end of the tweet if there's space
    let spaceForLogoUrl = 280 - potentialTweet.length - 24; // 24 chars for the URL shortening
    if (spaceForLogoUrl > 0) {
      tweetText = potentialTweet + ` [${logoUrl}]`;
    } else {
      tweetText = potentialTweet;
    }

    // Truncate if still too long
    if (tweetText.length > 280) {
      const maxMeaningLength =
        280 - (tweetText.length - item.meaning.length) - 3; // Adjust for ellipsis and other text
      const truncatedMeaning = item.meaning.slice(0, maxMeaningLength) + "...";
      tweetText = `Check out this ${itemType}: "${textToShare}"\nMeaning: "${truncatedMeaning}"\n[${websiteLink}] - via ${viaText} [${logoUrl}]`;
    }

    const shareToTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(shareToTwitterUrl, "_blank");
  };

  return {
    ShareToTwitter,
    upvote,
    downvote,
    showFullText,
  };
}
