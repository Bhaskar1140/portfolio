package com.bhaskar.portfoliobackend.Controller;

import com.bhaskar.portfoliobackend.DTO.ProjectRequest;
import com.bhaskar.portfoliobackend.DTO.ProjectResponse;
import com.bhaskar.portfoliobackend.Service.ProjectServices;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
public class ProjectController {
    private final ProjectServices projectServices;

    public ProjectController(ProjectServices projectServices){
        this.projectServices = projectServices;
    }

    @GetMapping("/api/projects")
    public List<ProjectResponse> getAllProjects(){
        return projectServices.getAllProjects();
    }

    @GetMapping("/api/projects/{id}")
    public  ProjectResponse getProjectById(@PathVariable String id){
        return  projectServices.getProjectById(id);
    }

    @PostMapping("/api/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(@Valid @RequestBody ProjectRequest projectRequest){

        return projectServices.createProject(projectRequest);
    }

    @PutMapping("/api/projects/{id}")
    public ProjectResponse updateProject(
            @PathVariable String id,
            @RequestBody ProjectRequest projectRequest
    )
    {
        return projectServices.updateProject(id,projectRequest);
    }

    @DeleteMapping("/api/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public String deleteProject(@PathVariable String id){
        projectServices.deleteProject(id);
        return "Project Deleted SuccessFully";
    }
}
