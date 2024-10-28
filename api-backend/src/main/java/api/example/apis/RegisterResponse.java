/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package api.example.apis;

/**
 *
 * @author Sebastian
 */
    public class RegisterResponse {
        private boolean success;
        private String message;
    
        // Constructor
        public RegisterResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    
        // Getters y Setters
        public boolean isSuccess() {
            return success;
        }
    
        public void setSuccess(boolean success) {
            this.success = success;
        }
    
        public String getMessage() {
            return message;
        }
    
        public void setMessage(String message) {
            this.message = message;
        }
    }
    