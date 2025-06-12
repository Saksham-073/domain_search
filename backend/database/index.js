const mongoose = require('mongoose');
const SearchHistory = require('../models/SearchHistory');
require('dotenv').config();

async function connectToDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI;

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB successfully');
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(` Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

    } catch (error) {
        console.error(' MongoDB connection error:', error);
        process.exit(1);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error(' MongoDB error:', err);
});

mongoose.connection.on('reconnected', () => {
    console.log(' MongoDB reconnected');
});

async function saveSearchHistory(sessionId, domain, result, apiSource) {
    try {
        const searchHistory = new SearchHistory({
            sessionId,
            domain,
            searchResult: result,
            apiSource
        });

        await searchHistory.save();
        console.log(`📝 Search history saved for domain: ${domain}`);
    } catch (error) {
        console.error('Error saving search history:', error);
    }
}

async function getSearchHistory(sessionId) {
    try {
        const history = await SearchHistory
            .find({ sessionId })
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        return history.map(item => ({
            id: item._id.toString(),
            domain: item.domain,
            result: item.searchResult,
            apiSource: item.apiSource,
            timestamp: item.timestamp
        }));
    } catch (error) {
        console.error('Error fetching search history:', error);
        throw error;
    }
}

async function deleteHistoryItem(id, sessionId) {
    try {
        const objectId = mongoose.Types.ObjectId.isValid(id) ? id : new mongoose.Types.ObjectId(id);

        const result = await SearchHistory.deleteOne({
            _id: objectId,
            sessionId
        });

        return {
            changes: result.deletedCount,
            success: result.deletedCount > 0
        };
    } catch (error) {
        console.error('Error deleting history item:', error);
        throw error;
    }
}

async function getSearchStats(sessionId) {
    try {
        const stats = await SearchHistory.aggregate([
            { $match: { sessionId } },
            {
                $group: {
                    _id: '$apiSource',
                    count: { $sum: 1 },
                    domains: { $addToSet: '$domain' }
                }
            }
        ]);

        const totalSearches = await SearchHistory.countDocuments({ sessionId });

        return {
            totalSearches,
            breakdown: stats
        };
    } catch (error) {
        console.error('Error fetching search stats:', error);
        throw error;
    }
}

async function clearSearchHistory(sessionId) {
    try {
        const result = await SearchHistory.deleteMany({ sessionId });
        return {
            deletedCount: result.deletedCount,
            success: result.deletedCount > 0
        };
    } catch (error) {
        console.error('Error clearing search history:', error);
        throw error;
    }
}

async function getDomainSearchCount(domain) {
    try {
        const count = await SearchHistory.countDocuments({ domain });
        return count;
    } catch (error) {
        console.error('Error getting domain search count:', error);
        throw error;
    }
}

connectToDatabase();

module.exports = {
    connectToDatabase,
    saveSearchHistory,
    getSearchHistory,
    deleteHistoryItem,
    getSearchStats,
    clearSearchHistory,
    getDomainSearchCount,

    connection: mongoose.connection
}; 