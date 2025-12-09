# Application Startup Troubleshooting Guide

## Common Issues and Solutions

### 1. **Database Connection Error**

**Error Message:**
```
Communications link failure
Access denied for user 'root'@'localhost'
Unknown database 'ems'
```

**Solutions:**
- Ensure MySQL is running:
  ```bash
  # Check MySQL service status (Windows)
  sc query MySQL80
  # Or start MySQL service
  net start MySQL80
  ```

- Create the database if it doesn't exist:
  ```sql
  CREATE DATABASE ems;
  ```

- Verify database credentials in `application.properties`:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/ems
  spring.datasource.username=root
  spring.datasource.password=vamshi
  ```

### 2. **Port Already in Use**

**Error Message:**
```
Port 8080 is already in use
```

**Solutions:**
- Find and kill the process using port 8080:
  ```bash
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```

- Or change the port in `application.properties`:
  ```properties
  server.port=8081
  ```

### 3. **Java Version Mismatch**

**Error Message:**
```
Unsupported class file major version
```

**Solution:**
- Ensure Java 17 is installed and set as JAVA_HOME:
  ```bash
  java -version
  # Should show version 17 or higher
  ```

### 4. **Missing Dependencies**

**Error Message:**
```
ClassNotFoundException
NoClassDefFoundError
```

**Solution:**
- Clean and rebuild the project:
  ```bash
  mvn clean install
  ```

### 5. **Compilation Errors**

**Solution:**
- Check for compilation errors:
  ```bash
  mvn clean compile
  ```

### 6. **Application Properties Issues**

**Check these settings in `application.properties`:**
```properties
# Database connection
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=root
spring.datasource.password=vamshi

# JPA settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server port (optional)
server.port=8080
```

## Step-by-Step Startup Process

### 1. **Verify Prerequisites**
- ✅ Java 17+ installed
- ✅ MySQL installed and running
- ✅ Database `ems` created
- ✅ Maven installed

### 2. **Start MySQL**
```bash
# Windows
net start MySQL80

# Or use MySQL Workbench/Command Line
mysql -u root -p
```

### 3. **Create Database (if not exists)**
```sql
CREATE DATABASE IF NOT EXISTS ems;
USE ems;
```

### 4. **Build the Project**
```bash
mvn clean install
```

### 5. **Run the Application**
```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using Java
java -jar target/AlllMyKnowl-0.0.1-SNAPSHOT.jar

# Option 3: Run from IDE
# Right-click AlllMyKnowlApplication.java -> Run
```

### 6. **Verify Application Started**
- Check console for: `Started AlllMyKnowlApplication in X.XXX seconds`
- Open browser: `http://localhost:8080`
- Check logs for any errors

## Common Error Messages and Fixes

### "Cannot connect to database"
- Check MySQL is running
- Verify credentials in application.properties
- Ensure database `ems` exists

### "Port 8080 already in use"
- Stop other applications using port 8080
- Or change port in application.properties

### "Table doesn't exist"
- Check `spring.jpa.hibernate.ddl-auto=update` is set
- Application will create tables automatically on first run

### "ClassNotFoundException: OtpResponse"
- Ensure all DTOs are in the correct package: `com.emp.ems.dto`
- Run `mvn clean compile` to rebuild

## Quick Diagnostic Commands

```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Clean and compile
mvn clean compile

# Run with verbose logging
mvn spring-boot:run -X
```

## Still Not Working?

1. Check the full error message in the console
2. Look for stack traces pointing to specific classes
3. Verify all files are in correct packages
4. Ensure no syntax errors in Java files
5. Check if all required DTOs exist:
   - `OtpResponse.java`
   - `LoginResponse.java`
   - `OtpLoginRequest.java`


