package com.GymPass.GymProject.controller;

import com.GymPass.GymProject.Service.GymJoinRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/requests")
@RequiredArgsConstructor
public class GymJoinRequestController {

    private final GymJoinRequestService requestService;

    @PostMapping("/send")
    public ResponseEntity<String> sendRequest(
            @RequestParam Long userId,
            @RequestParam Long gymId
    ) {
        requestService.sendRequest(userId, gymId);
        return ResponseEntity.ok("Request sent");
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<String> accept(@PathVariable Long id) {
        requestService.acceptRequest(id);
        return ResponseEntity.ok("Request accepted");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<String> reject(@PathVariable Long id) {
        requestService.rejectRequest(id);
        return ResponseEntity.ok("Request rejected");
    }
}
