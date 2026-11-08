package com.ayni.api.demo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.time.Instant;

@Entity
@Table(name = "ayni_demo_state")
public class DemoStateEntity {

    @Id
    @Column(name = "state_key", length = 40, nullable = false)
    private String stateKey;

    @Lob
    @Column(name = "payload", columnDefinition = "LONGTEXT", nullable = false)
    private String payload;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    private Long version;

    protected DemoStateEntity() {}

    public DemoStateEntity(String stateKey, String payload) {
        this.stateKey = stateKey;
        this.payload = payload;
        this.updatedAt = Instant.now();
    }

    public String getStateKey() { return stateKey; }
    public String getPayload() { return payload; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Long getVersion() { return version; }

    public void updatePayload(String payload) {
        this.payload = payload;
        this.updatedAt = Instant.now();
    }
}
