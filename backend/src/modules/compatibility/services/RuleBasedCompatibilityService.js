class RuleBasedCompatibilityService {
  static calculateScore(profile, room) {
    let score = 0;
    
    // Budget Match (40 pts)
    const rent = Number(room.rent);
    const min = Number(profile.minBudget);
    const max = Number(profile.maxBudget);
    if (rent >= min && rent <= max) score += 40;
    else if (rent < min) score += 30; // slightly cheaper is ok
    else if (rent > max && rent <= max + 5000) score += 20; // slightly over budget

    // Location Match (40 pts)
    const roomLoc = room.location.toLowerCase();
    const profLoc = profile.preferredLocation.toLowerCase();
    if (roomLoc.includes(profLoc) || profLoc.includes(roomLoc)) {
      score += 40;
    }

    // Move in Date (20 pts)
    if (new Date(room.availableFrom) <= new Date(profile.moveInDate)) {
      score += 20;
    }

    let explanation = "This room only partially aligns with your preferences.";
    if (score >= 80) {
      explanation = "Based on your budget and location preferences, this room is an excellent match for you.";
    } else if (score >= 60) {
      explanation = "This room is a good match, though it may be slightly outside your ideal location or budget.";
    }

    return {
      score,
      explanation
    };
  }
}

module.exports = RuleBasedCompatibilityService;
