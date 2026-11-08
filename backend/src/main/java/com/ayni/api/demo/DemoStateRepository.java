package com.ayni.api.demo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DemoStateRepository extends JpaRepository<DemoStateEntity, String> {}
