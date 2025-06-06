import { ALGOLIA_APP_ID, ALGOLIA_INSIGHTS_API_KEY } from './algoliaClient';

// Simple Insights implementation
class AlgoliaInsights {
  constructor(appId, apiKey) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.userToken = this.getUserToken();
  }

  getUserToken() {
    let userToken = localStorage.getItem('algolia_user_token');
    if (!userToken) {
      userToken = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('algolia_user_token', userToken);
    }
    return userToken;
  }

  async sendEvent(eventType, eventData) {
    const event = {
      eventType,
      eventName: eventData.eventName,
      index: eventData.index,
      userToken: this.userToken,
      objectIDs: eventData.objectIDs,
      timestamp: Date.now()
    };

    // Add optional fields only if they exist
    if (eventData.eventSubtype) event.eventSubtype = eventData.eventSubtype;
    if (eventData.queryID) event.queryID = eventData.queryID;
    if (eventData.positions) event.positions = eventData.positions;
    if (eventData.value !== undefined) event.value = eventData.value;
    if (eventData.currency) event.currency = eventData.currency;
    if (eventData.objectData) event.objectData = eventData.objectData;

    const eventPayload = {
      events: [event]
    };

    console.log('Sending Algolia Insights event:', eventPayload);

    try {
      const response = await fetch(`https://insights.algolia.io/1/events`, {
        method: 'POST',
        headers: {
          'X-Algolia-API-Key': this.apiKey,
          'X-Algolia-Application-Id': this.appId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload)
      });
      
      if (!response.ok) {
        console.error('Insights event failed:', response.status, await response.text());
      } else {
        console.log('Insights event sent successfully:', response.status);
      }
    } catch (error) {
      console.error('Failed to send insights event:', error);
    }
  }

  // Click event when user clicks on search result
  clickedObjectIDsAfterSearch(eventName, index, objectIDs, positions, queryID) {
    console.log('Click event (after search) called with:', { eventName, index, objectIDs, positions, queryID });
    this.sendEvent('click', {
      eventName,
      index,
      objectIDs,
      positions,
      queryID
    });
  }

  // Click event (direct, not from search)
  clickedObjectIDs(eventName, index, objectIDs) {
    console.log('Click event (direct) called with:', { eventName, index, objectIDs });
    this.sendEvent('click', {
      eventName,
      index,
      objectIDs
    });
  }

  // NOTE: View events should be automatic when using InstantSearch with insights: true
  // View events are sent automatically when search results (objectIDs) are displayed to users
  // You should NOT manually send view events for search results

  // Manual view event for non-search pages (if needed)
  viewedObjectIDs(eventName, index, objectIDs) {
    console.log('Manual view event called with:', { eventName, index, objectIDs });
    console.warn('Consider if this view event is necessary - InstantSearch automatically sends view events for search results');
    this.sendEvent('view', {
      eventName,
      index,
      objectIDs
    });
  }

  // Add to cart event (after search) - specific subtype
  addedToCartObjectIDsAfterSearch(eventName, index, objectIDs, queryID, value, objectData = null) {
    console.log('Add to cart event (after search) called with:', { eventName, index, objectIDs, queryID, value, objectData });
    this.sendEvent('conversion', {
      eventName,
      eventSubtype: 'addToCart',
      index,
      objectIDs,
      queryID,
      value,
      currency: 'MXN',
      objectData
    });
  }

  // Add to cart event (direct, not from search) - specific subtype
  addedToCartObjectIDs(eventName, index, objectIDs, value, objectData = null) {
    console.log('Add to cart event (direct) called with:', { eventName, index, objectIDs, value, objectData });
    this.sendEvent('conversion', {
      eventName,
      eventSubtype: 'addToCart',
      index,
      objectIDs,
      value,
      currency: 'MXN',
      objectData
    });
  }

  // Purchase event with revenue tracking (after search) - specific subtype
  purchasedObjectIDsAfterSearch(eventName, index, objectIDs, queryID, value, objectData) {
    console.log('Purchase event (after search) called with:', { eventName, index, objectIDs, queryID, value, objectData });
    this.sendEvent('conversion', {
      eventName,
      eventSubtype: 'purchase',
      index,
      objectIDs,
      queryID,
      value,
      currency: 'MXN',
      objectData
    });
  }

  // Purchase event (direct, not from search) - specific subtype
  purchasedObjectIDs(eventName, index, objectIDs, value, objectData) {
    console.log('Purchase event (direct) called with:', { eventName, index, objectIDs, value, objectData });
    this.sendEvent('conversion', {
      eventName,
      eventSubtype: 'purchase',
      index,
      objectIDs,
      value,
      currency: 'MXN',
      objectData
    });
  }

  // Batch purchase event for multiple items (more efficient for purchases with multiple items)
  purchasedObjectIDsBatch(eventName, index, purchases) {
    console.log('Batch purchase event called with:', { eventName, index, purchases });
    
    purchases.forEach(purchase => {
      if (purchase.queryID) {
        this.purchasedObjectIDsAfterSearch(
          eventName,
          index,
          [purchase.objectID],
          purchase.queryID,
          purchase.value,
          purchase.objectData
        );
      } else {
        this.purchasedObjectIDs(
          eventName,
          index,
          [purchase.objectID],
          purchase.value,
          purchase.objectData
        );
      }
    });
  }

  // Generic conversion event (after search) - for other conversion types
  convertedObjectIDsAfterSearch(eventName, index, objectIDs, queryID, value) {
    console.log('Conversion event (after search) called with:', { eventName, index, objectIDs, queryID, value });
    this.sendEvent('conversion', {
      eventName,
      index,
      objectIDs,
      queryID,
      value,
      currency: 'MXN'
    });
  }

  // Generic conversion event (direct, not from search) - for other conversion types
  convertedObjectIDs(eventName, index, objectIDs, value) {
    console.log('Conversion event (direct) called with:', { eventName, index, objectIDs, value });
    this.sendEvent('conversion', {
      eventName,
      index,
      objectIDs,
      value,
      currency: 'MXN'
    });
  }
}

export const insights = new AlgoliaInsights(ALGOLIA_APP_ID, ALGOLIA_INSIGHTS_API_KEY); 