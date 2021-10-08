export class Keys {
  // How long to wait before retrying an operation
  public static readonly RETRY_DELAY_MS_KEY = 'retryDelay';
  public static readonly DEFAULT_RETRY_DELAY_MS = 10000;

  // ***** JWT *****
  // If a JWT renewal fails, how long to wait befre retrying
  public static readonly JWT_RENEWAL_RETRY_DELAY_MS_KEY = 'jwtRetryDelayMs';
  public static readonly JWT_RENEWAL_RETRY_DELAY_MS = 1000 * 20; // 20 seconds
  public static readonly JWT_RENEWAL_TIMER_ENABLED = 'jtwRenewalTimerEnable';
  // The max amount of time we'll wait to renew a JWT
  public static readonly JWT_MAX_RENEW_WAIT_TIME_MS_KEY = 'jwtMaxWaitTimeMs';
  public static readonly JWT_MAX_RENEW_WAIT_TIME_MS_DEFAULT = 1000 * 60 * 60 * 48; // 48 hour max wait time
  // The min amount of time we'll wait to renew a JWT
  public static readonly JWT_MIN_RENEW_WAIT_TIME_MS_KEY = 'jwtMinWaitTimeMs';
  public static readonly JWT_MIN_RENEW_WAIT_TIME_MS_DEFAULT = 1000 * 60 * 2; // 2 min wait time
  // A JWT is given a fixed amount of time it lives.  Renew it this many milliseconds before it
  // expires (as long as that time is within the min and max times).  Give this enough time for the JWT RENEWAL retry to
  // run once or twice so we can retry on a failure
  public static readonly JWT_WAIT_BUFFER_MS_KEY = 'jwtWaitBufferMs';
  public static readonly JWT_WAIT_BUFFER_MS_DEFAULT = 1000 * 60 * 2; // 2 minutes before failure
  // ***** END JWT *****

  // How often to ping the dependencies
  public static readonly PING_DEPENDENCIES_FREQUENCY_MS_KEY = 'pingDependenciesFrequenceyMs';
  public static readonly PING_DEPENDENCIES_FREQUENCY_MS_DEFAULT = 30000;
  public static readonly PING_TIMEOUT_MS = Keys.PING_DEPENDENCIES_FREQUENCY_MS_DEFAULT * 2;

  public static readonly DEFAULT_SNACKBAR_DURATION_MS = 5000;

  // Feature Toggles
  public static readonly USE_MOCK_DATA = 'useMockData';
  public static readonly TRUE = true;
}

