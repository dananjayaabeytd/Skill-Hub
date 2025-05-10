package com.paf.skillhub.User.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.paf.skillhub.Auth.models.Role;
import com.paf.skillhub.Follow.models.Follower;
import com.paf.skillhub.Skill.models.Skill;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "users",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
    })
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long userId;

  @NotBlank
  @Size(max = 20)
  @Column(name = "username")
  private String userName;

  @NotBlank
  @Size(max = 50)
  @Email
  @Column(name = "email")
  private String email;

  @Size(max = 120)
  @Column(name = "password")
  @JsonIgnore
  private String password;

  private boolean accountNonLocked = true;
  private boolean accountNonExpired = true;
  private boolean credentialsNonExpired = true;
  private boolean enabled = true;

  // New fields for premium status
  private boolean isPremium = false;
  private LocalDateTime lastPaymentDateTime;

  private LocalDate credentialsExpiryDate;
  private LocalDate accountExpiryDate;

  private String twoFactorSecret;
  private boolean isTwoFactorEnabled = false;
  private String signUpMethod;

  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "role_id", referencedColumnName = "role_id")
  @ToString.Exclude // Prevent circular reference
  private Role role;

  @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(name = "user_skills",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "skill_id"))
  @JsonManagedReference
  @ToString.Exclude // Prevent circular reference
  private Set<Skill> skills = new HashSet<>();

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdDate;

  @UpdateTimestamp
  private LocalDateTime updatedDate;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  @ToString.Exclude // Prevent circular reference
  private Set<Follower> followers = new HashSet<>();

  @OneToMany(mappedBy = "followerUser")
  @JsonIgnore
  @ToString.Exclude // Prevent circular reference
  private Set<Follower> following = new HashSet<>();

  public User(String userName, String email, String password) {
    this.userName = userName;
    this.email = email;
    this.password = password;
  }

  public User(String userName, String email) {
    this.userName = userName;
    this.email = email;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof User)) {
      return false;
    }
    return userId != null && userId.equals(((User) o).getUserId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }


  public boolean isAccountNonLocked() {
    return accountNonLocked;
}

public void setAccountNonLocked(boolean accountNonLocked) {
    this.accountNonLocked = accountNonLocked;
}

public boolean isAccountNonExpired() {
    return accountNonExpired;
}

public void setAccountNonExpired(boolean accountNonExpired) {
    this.accountNonExpired = accountNonExpired;
}

public boolean isCredentialsNonExpired() {
    return credentialsNonExpired;
}

public void setCredentialsNonExpired(boolean credentialsNonExpired) {
    this.credentialsNonExpired = credentialsNonExpired;
}

public boolean isEnabled() {
    return enabled;
}

public void setEnabled(boolean enabled) {
    this.enabled = enabled;
}

public LocalDate getCredentialsExpiryDate() {
    return credentialsExpiryDate;
}

public void setCredentialsExpiryDate(LocalDate credentialsExpiryDate) {
    this.credentialsExpiryDate = credentialsExpiryDate;
}

public LocalDate getAccountExpiryDate() {
    return accountExpiryDate;
}

public void setAccountExpiryDate(LocalDate accountExpiryDate) {
    this.accountExpiryDate = accountExpiryDate;
}

public boolean isTwoFactorEnabled() {
    return isTwoFactorEnabled;
}

public void setTwoFactorEnabled(boolean twoFactorEnabled) {
    isTwoFactorEnabled = twoFactorEnabled;
}

public String getSignUpMethod() {
    return signUpMethod;
}

public void setSignUpMethod(String signUpMethod) {
    this.signUpMethod = signUpMethod;
}

}