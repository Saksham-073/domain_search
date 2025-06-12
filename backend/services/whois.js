const whois = require('whois');
const NodeCache = require('node-cache');
const domainCache = new NodeCache({ stdTTL: 3600 });

function parseWhoisDate(dateString) {
  if (!dateString) return null;
  
  const cleanDate = dateString.trim();
  
  const dateFormats = [
    /(\d{4}-\d{2}-\d{2})/,                    // 2024-12-31
    /(\d{2}-\d{2}-\d{4})/,                    // 31-12-2024
    /(\d{2}\/\d{2}\/\d{4})/,                  // 31/12/2024
    /(\d{4}\/\d{2}\/\d{2})/,                  // 2024/12/31
    /(\d{2}\.\d{2}\.\d{4})/,                  // 31.12.2024
    /(\d{4}\.\d{2}\.\d{2})/,                  // 2024.12.31
    /(\d{1,2}\s+\w+\s+\d{4})/,               // 31 Dec 2024
    /(\w+\s+\d{1,2},?\s+\d{4})/,             // December 31, 2024
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/   // ISO format with time
  ];
  
  for (const format of dateFormats) {
    const match = cleanDate.match(format);
    if (match) {
      let dateStr = match[1];
      
      // Convert to standard YYYY-MM-DD format
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts[0].length === 4) {
          // YYYY/MM/DD format
          dateStr = parts.join('-');
        } else if (parts[2].length === 4) {
          // DD/MM/YYYY format
          dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      } else if (dateStr.includes('.')) {
        const parts = dateStr.split('.');
        if (parts[0].length === 4) {
          // YYYY.MM.DD format
          dateStr = parts.join('-');
        } else if (parts[2].length === 4) {
          // DD.MM.YYYY format
          dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      } else if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
        // DD-MM-YYYY format
        const parts = dateStr.split('-');
        if (parts[2].length === 4) {
          dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      } else if (dateStr.includes('T')) {
        // ISO format with time - extract just the date part
        dateStr = dateStr.split('T')[0];
      }
      
      // Validate the date format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
    }
  }
  
  return null;
}

async function performWhoisLookup(domain) {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, (err, data) => {
      if (err) {
        if (err.message && (
          err.message.includes('ENOTFOUND') || 
          err.message.includes('timeout') ||
          err.message.includes('ECONNREFUSED')
        )) {
          const tld = domain.split('.').pop().toLowerCase();
          resolve({
            domain: domain,
            available: false, 
            registrar: `Information not available (${tld} WHOIS server issue)`,
            createdDate: null,
            updatedDate: null,
            expiryDate: null,
            nameServers: [],
            source: 'internal',
            error: `WHOIS lookup failed for .${tld} domains`,
            fallback: true
          });
          return;
        }
        reject(err);
        return;
      }

      try {
        const lines = data.split('\n');
        const result = {
          domain: domain,
          available: false,
          registrar: null,
          createdDate: null,
          updatedDate: null,
          expiryDate: null,
          nameServers: [],
          source: 'internal'
        };

        const lowerData = data.toLowerCase();
        
        const registrationIndicators = [
          'registrar:',
          'creation date:',
          'created:',
          'registry expiry date:',
          'registrar registration expiration date:',
          'expires:',
          'name server:',
          'nameserver:',
          'registry domain id:',
          'domain status:'
        ];
        
        const hasRegistrationData = registrationIndicators.some(indicator => 
          lowerData.includes(indicator)
        );
        
        if (hasRegistrationData) {
          result.available = false;
        } else {
          const availabilityIndicators = [
            'no match',
            'not found',
            'no matching record',
            'status: available',
            'no data found',
            'no entries found',
            'domain not found',
            'not registered',
            'no records matching',
            'no matching record found',
            'domain status: no object found',
            'object does not exist',
            'status: free'
          ];
          
          const isAvailable = availabilityIndicators.some(indicator => 
            lowerData.includes(indicator)
          );

          if (isAvailable) {
            result.available = true;
            resolve(result);
            return;
          } else {
            result.available = false;
          }
        }

        lines.forEach(line => {
          const lowerLine = line.toLowerCase();
          
          if (lowerLine.includes('registrar:') && !result.registrar) {
            result.registrar = line.split(':')[1]?.trim();
          }
          
          const creationFields = [
            'creation date:',
            'created:',
            'created on:',
            'registered:',
            'registered on:',
            'registration date:',
            'domain registered:',
            'created date:'
          ];
          
          const hasCreationField = creationFields.some(field => lowerLine.includes(field));
          
          if (hasCreationField && !result.createdDate) {
            const datePart = line.split(':')[1];
            if (datePart) {
              const parsedDate = parseWhoisDate(datePart);
              if (parsedDate) {
                result.createdDate = parsedDate;
              }
            }
          }
          
          const updatedFields = [
            'updated date:',
            'updated:',
            'updated on:',
            'last updated:',
            'last modified:',
            'changed:',
            'modified:',
            'last update:'
          ];
          
          const hasUpdatedField = updatedFields.some(field => lowerLine.includes(field));
          
          if (hasUpdatedField && !result.updatedDate) {
            const datePart = line.split(':')[1];
            if (datePart) {
              const parsedDate = parseWhoisDate(datePart);
              if (parsedDate) {
                result.updatedDate = parsedDate;
              }
            }
          }
          
          const expiryFields = [
            'expiry date:',
            'expires:',
            'registry expiry date:',
            'registrar registration expiration date:',
            'expiration date:',
            'expire date:',
            'expires on:',
            'domain expires:',
            'paid-till:',
            'renewal date:',
            'expiration time:',
            'expire:',
            'valid until:'
          ];
          
          const hasExpiryField = expiryFields.some(field => lowerLine.includes(field));
          
          if (hasExpiryField && !result.expiryDate) {
            const datePart = line.split(':')[1];
            if (datePart) {
              const parsedDate = parseWhoisDate(datePart);
              if (parsedDate) {
                result.expiryDate = parsedDate;
              }
            }
          }
          
          if (lowerLine.includes('name server:') || lowerLine.includes('nameserver:')) {
            const ns = line.split(':')[1]?.trim();
            if (ns && !result.nameServers.includes(ns)) {
              result.nameServers.push(ns);
            }
          }
        });

        resolve(result);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

async function getDomainInfo(domain) {
  const cacheKey = `domain_${domain}`;
  const cachedResult = domainCache.get(cacheKey);
  
  if (cachedResult) {
    return { ...cachedResult, fromCache: true };
  }

  try {
    const result = await performWhoisLookup(domain);
    
    domainCache.set(cacheKey, result);
    
    return { ...result, fromCache: false };
  } catch (error) {
    throw new Error(`Failed to lookup domain: ${error.message}`);
  }
}

module.exports = {
  performWhoisLookup,
  getDomainInfo,
  domainCache
}; 