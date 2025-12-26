package com.GymPass.GymProject.controller;

import com.GymPass.GymProject.Service.GymSessionService;
import com.GymPass.GymProject.entity.GymSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class GymSessionController {

    private final GymSessionService sessionService;

    @PostMapping("/start")
    public ResponseEntity<String> startSession(
            @RequestParam Long requestId
    ) {
        sessionService.startSession(requestId);
        return ResponseEntity.ok("Session started");
    }

    @GetMapping("/active")
    public ResponseEntity<GymSession> getActiveSession(
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(sessionService.getActiveSession(userId));
    }
    @PostMapping("/{id}/end")
    public GymSession endSession(@PathVariable Long id) {
        return sessionService.endSession(id);
    }
   //@PostMapping("/sessions/end")
    //public GymSession endSession(@RequestParam Long sessionId) {
      //  return sessionService.endSession(sessionId);
    //}

}
