package com.codify.codify_lms.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    public String extractEmail(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid token");
        }

        String jwt = token.replace("Bearer ", "");
        DecodedJWT decoded = JWT.decode(jwt);
        return decoded.getClaim("email").asString();
    }


    public String extractUserId(String token) {
        String jwt = token.replace("Bearer ", "");
        DecodedJWT decoded = JWT.decode(jwt);
        return decoded.getSubject(); // Supabase default: "sub" → user_id
    }
}
