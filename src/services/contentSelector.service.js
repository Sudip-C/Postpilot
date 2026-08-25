import { contentPillars } from "../config/contentPillars.js";
import { postTypes } from "../config/postTypes.js";

function selectWeightedPillar() {
  const randomValue = Math.random() * 100;

  let cumulativeWeight = 0;

  for (const pillar of contentPillars) {
    cumulativeWeight += pillar.weight;

    if (randomValue < cumulativeWeight) {
      return pillar;
    }
  }

  return contentPillars[contentPillars.length - 1];
}

function selectRandomPostType() {
  const index = Math.floor(Math.random() * postTypes.length);

  return postTypes[index];
}

export function getTodayContentPlan() {
  const pillar = selectWeightedPillar();
  const postType = selectRandomPostType();

  return {
    pillar: {
      id: pillar.id,
      name: pillar.name,
      description: pillar.description,
    },

    postType: {
      id: postType.id,
      name: postType.name,
      description: postType.description,
    },
  };
}