package com.example.jwt_nimbus_demo.controllers;

import com.example.jwt_nimbus_demo.entity.User;
import com.example.jwt_nimbus_demo.models.LoginResponse;
import com.example.jwt_nimbus_demo.models.LoginUserModel;
import com.example.jwt_nimbus_demo.models.RegisterUserModel;
import com.example.jwt_nimbus_demo.services.AuthenticationService;
import com.example.jwt_nimbus_demo.services.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserModel registerUser) {
        User registeredUser = authenticationService.signup(registerUser);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserModel loginUser) {
        User authenticatedUser = authenticationService.authenticate(loginUser);
        
        String jwtToken = jwtService.generateToken(authenticatedUser);
        
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        
        return ResponseEntity.ok(loginResponse);
    }
}
