package api.example.apis;

public class LoginResponse {
    private boolean success;
    private String message;
    private Long usuarioId;
    private String nomRol;

    public LoginResponse(boolean success, String message, Long usuarioId, String nomRol) {
        this.success = success;
        this.message = message;
        this.usuarioId = usuarioId;
        this.nomRol = nomRol;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNomRol() {
        return nomRol;
    }

    public void setNomRol(String nomRol) {
        this.nomRol = nomRol;
    }
    

    

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
