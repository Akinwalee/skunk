const cooldowns = new Map();

function setCooldown(command, userId, duration) {
  cooldowns.set(command, {
    userId,
    expires: Date.now() + duration,
  });
}

function isOnCooldown(command, userId) {
  const cooldown = cooldowns.get(command);
  if (!cooldown) return false;
  if (cooldown.userId === userId && cooldown.expires < Date.now()) {
    return false;
  }
  return true;
}

function getRemainingCooldown(command) {
  const cooldown = cooldowns.get(command);
  if (!cooldown) return null;
  return Math.max(0, cooldown.expires - Date.now());
}

module.exports = {
  setCooldown,
  isOnCooldown,
  getRemainingCooldown,
};