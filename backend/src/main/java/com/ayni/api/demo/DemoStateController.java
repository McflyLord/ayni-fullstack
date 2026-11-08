package com.ayni.api.demo;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/demo/state")
@Tag(name = "Demo AYNI", description = "Persistencia del estado completo usado por el frontend de demostración")
public class DemoStateController {

    private static final String STATE_KEY = "frontend-demo";

    private final DemoStateRepository repository;
    private final ObjectMapper objectMapper;

    public DemoStateController(DemoStateRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "Obtener el estado guardado del frontend")
    public ResponseEntity<JsonNode> getState() {
        return repository.findById(STATE_KEY)
                .map(entity -> {
                    try {
                        return ResponseEntity.ok(objectMapper.readTree(entity.getPayload()));
                    } catch (Exception exception) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                "No se pudo leer el estado almacenado", exception);
                    }
                })
                .orElseGet(() -> ResponseEntity.<JsonNode>noContent().build());
    }

    @PutMapping
    @Transactional
    @Operation(summary = "Guardar el estado completo del frontend")
    public ResponseEntity<Map<String, Object>> saveState(@Valid @RequestBody JsonNode payload) {
        if (payload == null || !payload.isObject()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El cuerpo debe ser un objeto JSON");
        }

        try {
            String json = objectMapper.writeValueAsString(payload);
            DemoStateEntity state = repository.findById(STATE_KEY)
                    .orElseGet(() -> new DemoStateEntity(STATE_KEY, json));
            state.updatePayload(json);
            repository.save(state);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Estado de AYNI guardado en MySQL",
                    "updatedAt", state.getUpdatedAt().toString()
            ));
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se pudo guardar el estado", exception);
        }
    }
}
