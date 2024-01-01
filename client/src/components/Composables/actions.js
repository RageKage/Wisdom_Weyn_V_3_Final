import { useRouter } from "vue-router";

import AppApiService from "../../service/index";

export function Actions() {
  const service = AppApiService();
  const router = useRouter();

  // upvote a submission
  const upvote = async (itemId) => {
    try {
      await service.upvoteSubmission(itemId);
    } catch (error) {
      console.error(error);
    }
  };

  // downvote a submission
  const downvote = async (itemId) => {
    try {
      await service.downvoteSubmission(itemId);
    } catch (error) {
      console.error(error);
    }
  };

  // Share to Twitter
  const ShareToTwitter = (item) => {
    // item is an object

    const itemType = item.title ? "Poetry" : "Proverb";

    const textToShare = item.title || item.content;

    // twitter text
    let tweetText = `Check out this Somali ${itemType}: "${textToShare}"`;

    const viaText = " - via [Wisdom Weyn]";
    const websiteLink = "https://http://localhost:5173/"; // after app hosted replace this with the actual URL of your website
    const fullTextLink = ` - View full text: ${websiteLink}/displayPoetry/${item.id}`; // path to take the twitter user to the full text of the item in our site

    const logoUrl = "https://www.yourwebsite.com/logo.png";

    const potentialTweet =
      tweetText + fullTextLink + ` [${websiteLink}]` + viaText;

    // 280 is the max length of a tweet
    let spaceForLogoUrl = 280 - potentialTweet.length - 24; // 24 chars for the URL shortening
    if (spaceForLogoUrl > 0) {
      tweetText = potentialTweet + ` [${logoUrl}]`;
    } else {
      tweetText = potentialTweet;
    }

    // Truncate if still too long
    if (tweetText.length > 280) {
      const maxMeaningLength =
        280 - (tweetText.length - item.meaning.length) - 3; // 3 chars for the ellipsis
      const truncatedMeaning = item.meaning.slice(0, maxMeaningLength) + "...";
      tweetText = `Check out this Somali${itemType}: "${textToShare}"\nMeaning: "${truncatedMeaning}"\n[${websiteLink}] - via ${viaText} [${logoUrl}]`;
    }

    const shareToTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(shareToTwitterUrl, "_blank");
  };

  // Show the full text of the item
  const showFullText = async (itemId) => {
    try {
      // take the user to the displayPoetry page along with the item id
      router.push({
        name: "displayPoetry",
        params: {
          id: itemId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // take a user to a user dashboard
  const userdashboard = (email) => {
    try {
      router.push({
        name: "dashboard",
        params: {
          id: email,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // TODO finish this delete logic

  const deleteSubmission = async (itemID) => {
    try {
      await service.deleteSubmission(itemID);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    ShareToTwitter,
    upvote,
    downvote,
    showFullText,
    userdashboard,
  };
}
