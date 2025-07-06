# 🔌 API Reference

## Authentication
- `POST /api/auth/register`: Register user

![image](https://github.com/user-attachments/assets/6abc0d57-5314-44c3-89c6-57cd389bb8ea)

- `POST /api/auth/login`: Login, returns JWT token
  - Make sure to copy the JWT token for later use.
  
![image](https://github.com/user-attachments/assets/4387ab4b-e6eb-4ee4-b2e6-dd37cae39aae)

## Prediction
- `POST /api/predict`: Predict your skin lesion
  - Configure the header with JWT token
    
![image](https://github.com/user-attachments/assets/8b1ca55f-b06a-4176-b86d-63e861e9a1d6)

  - Add in the desired photo
    
![image](https://github.com/user-attachments/assets/b63ad5e6-106f-4fd6-8996-9abbe4ffd7f3)

## History
- `GET /api/history`: Get your photo history

![image](https://github.com/user-attachments/assets/488ea2f5-b173-4606-a4f0-bdcc516ce259)

- `GET /api/history/protected`: JWT Authentication

![image](https://github.com/user-attachments/assets/45876a10-172d-415a-9ca0-cd9d7768a015)


## Feedback
- `Post /api/feedback`: Send feedback correlated to pictures
  - Configure header
  
![image](https://github.com/user-attachments/assets/b9bb690b-17cc-437b-a8cc-ee937c3754b6)

  - Configure the body with the image id, comment, and if it is accurate

![image](https://github.com/user-attachments/assets/7f7b4749-64cb-460f-a78c-4280d34d565b)
