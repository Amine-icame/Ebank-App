package ma.emi.ebank_backend.security.filters;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class JwtAuthorizationFilter extends OncePerRequestFilter {

    // ATTENTION : Cette clé doit être la MÊME que celle utilisée pour créer le token (dans le Controller plus bas)
    // Elle doit faire au moins 256 bits (32 caractères)
    public static final String SECRET = "ma_cle_secrete_tres_longue_pour_la_securite_ebank_projet_2025";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. Si c'est une requête OPTIONS (CORS), on laisse passer
        if(request.getMethod().equals("OPTIONS")){
            filterChain.doFilter(request, response);
            return;
        }

        // 2. On récupère le header "Authorization"
        String jwt = request.getHeader("Authorization");

        // 3. Si pas de token ou ne commence pas par "Bearer ", on passe au filtre suivant (qui rejettera la requête)
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. On valide et décode le token
        try {
            SecretKey secretKey = Keys.hmacShaKeyFor(SECRET.getBytes());
            String token = jwt.substring(7); // On enlève "Bearer "

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            List<String> roles = claims.get("roles", List.class);

            // 5. On crée les autorités Spring
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            for (String r : roles) {
                authorities.add(new SimpleGrantedAuthority(r));
            }

            // 6. On authentifie l'utilisateur dans le contexte de sécurité
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // 7. On passe la main
            filterChain.doFilter(request, response);

        }catch (Exception e) {
            // AJOUTE CETTE LIGNE :
            e.printStackTrace(); // Affiche l'erreur rouge dans la console IntelliJ

            response.setHeader("error-message", e.getMessage());
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
    }
}