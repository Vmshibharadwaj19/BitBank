# How to Start the Application

## Quick Start Guide

### Step 1: Verify Prerequisites

1. **Java 17+** - Check version:
   ```bash
   java -version
   ```

2. **MySQL Running** - Check if MySQL service is running:
   ```bash
   # Windows
   sc query MySQL80
   # If not running, start it:
   net start MySQL80
   ```

3. **Database Exists** - Create database if needed:
   ```sql
   mysql -u root -p
   CREATE DATABASE IF NOT EXISTS ems;
   ```

### Step 2: Build the Project

```bash
cd "c:\Users\vamsh\OneDrive\Desktop\aws\AlllMyKnowl"
mvn clean install
```

### Step 3: Run the Application

**Option A: Using Maven**
```bash
mvn spring-boot:run
```

**Option B: Using Java**
```bash
java -jar target/AlllMyKnowl-0.0.1-SNAPSHOT.jar
```

**Option C: Using IDE (Eclipse/IntelliJ)**
1. Right-click on `AlllMyKnowlApplication.java`
2. Select "Run As" → "Java Application"

### Step 4: Verify It's Running

- Look for this message in console: `Started AlllMyKnowlApplication in X.XXX seconds`
- Open browser: `http://localhost:8080`
- Test API: `http://localhost:8080/api/customers` (should return empty array or customers)

## Common Issues

### Issue 1: "Cannot connect to database"

**Solution:**
1. Ensure MySQL is running
2. Check credentials in `src/main/resources/application.properties`
3. Verify database `ems` exists:
   ```sql
   SHOW DATABASES;
   ```

### Issue 2: "Port 8080 already in use"

**Solution:**
1. Find process using port 8080:
   ```bash
   netstat -ano | findstr :8080
   ```
2. Kill the process:
   ```bash
   taskkill /PID <PID_NUMBER> /F
   ```
3. Or change port in `application.properties`:
   ```properties
   server.port=8081
   ```

### Issue 3: "ClassNotFoundException"

**Solution:**
```bash
mvn clean compile
mvn spring-boot:run
```

### Issue 4: "Java version mismatch"

**Solution:**
- Ensure Java 17+ is installed
- Set JAVA_HOME environment variable
- Check: `java -version` should show 17 or higher

## Configuration Check

Verify these settings in `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=root
spring.datasource.password=vamshi

# Server
server.port=8080
```

## Testing the Application

Once running, test these endpoints:

1. **Get all customers:**
   ```
   GET http://localhost:8080/api/customers
   ```

2. **Request OTP:**
   ```
   POST http://localhost:8080/api/auth/request-otp?email=test@example.com
   ```

3. **Health check:**
   ```
   GET http://localhost:8080/api/customers
   ```

## Need Help?

If the application still won't start:

1. **Check the full error message** in the console
2. **Look for stack traces** - they show exactly what's wrong
3. **Verify all files exist:**
   - `OtpResponse.java` in `src/main/java/com/emp/ems/dto/`
   - `LoginResponse.java` in `src/main/java/com/emp/ems/dto/`
   - `OtpLoginRequest.java` in `src/main/java/com/emp/ems/dto/`

4. **Check logs** - Spring Boot shows detailed error messages

## Expected Console Output

When the application starts successfully, you should see:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.3.2)

... (various Spring Boot startup logs) ...

Started AlllMyKnowlApplication in X.XXX seconds
```

If you see errors instead, copy the full error message and check the troubleshooting guide.


