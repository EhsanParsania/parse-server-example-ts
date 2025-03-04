/**
 * Example TypeScript file for Parse Server cloud code
 *
 * This file demonstrates how to define cloud functions and triggers in TypeScript
 */
// Example cloud function
Parse.Cloud.define('helloWorld', async (request) => {
    const name = request.params.name || 'World';
    return `Hello, ${name}!`;
});
// Example before save trigger
Parse.Cloud.beforeSave('GameScore', async (request) => {
    const score = request.object.get('score');
    // Validate the score
    if (score < 0) {
        throw new Parse.Error(141, // Use error code directly instead of Parse.Error.INVALID_VALUE
        'Score cannot be negative');
    }
    // Add a timestamp
    request.object.set('lastUpdated', new Date());
});
// Example after save trigger
Parse.Cloud.afterSave('GameScore', async (request) => {
    // Get the saved object
    const gameScore = request.object;
    const score = gameScore.get('score');
    const playerName = gameScore.get('playerName');
    console.log(`Player ${playerName} saved a score of ${score}`);
    // You could update other objects here
    // For example, update a leaderboard or player stats
});
// Example before delete trigger
Parse.Cloud.beforeDelete('GameScore', async (request) => {
    // You can prevent deletion based on certain conditions
    const isAdmin = request.user && request.user.get('isAdmin');
    if (!isAdmin) {
        throw new Parse.Error(119, // Use error code directly instead of Parse.Error.OPERATION_FORBIDDEN
        'Only admins can delete game scores');
    }
});
// Example after delete trigger
Parse.Cloud.afterDelete('GameScore', async (request) => {
    // Clean up related data after deletion
    console.log(`GameScore ${request.object.id} was deleted`);
});
// Example of a scheduled job (uncomment when Parse.Cloud.job is available in your types)
/*
Parse.Cloud.job('cleanupOldScores', async (request) => {
  // This would be scheduled to run at certain intervals
  const query = new Parse.Query('GameScore');
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  query.lessThan('createdAt', oneMonthAgo);
  
  const results = await query.find({ useMasterKey: true });
  console.log(`Found ${results.length} old game scores to delete`);
  
  // Delete old scores
  // Use Parse.Object.destroyAll when available in your types
  for (const result of results) {
    await result.destroy({ useMasterKey: true });
  }
  
  return {
    status: 'success',
    message: `Deleted ${results.length} old game scores`
  };
});
*/ 
//# sourceMappingURL=example.js.map