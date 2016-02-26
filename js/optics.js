function optics(data, distRad, minPts) {

    /**
        OPTICS algorithm
    
    distRad  - distance of the neighborhood
    minPts - minimum number of objects

    Pseudocode wikipedia

    OPTICS(DB, eps, MinPts)
    for each point p of DB
       p.reachability-distance = UNDEFINED
    for each unprocessed point p of DB
       N = getNeighbors(p, eps)
       mark p as processed
       output p to the ordered list
       if (core-distance(p, eps, Minpts) != UNDEFINED)
          Seeds = empty priority queue
          update(N, p, Seeds, eps, Minpts)
          for each next q in Seeds
             N' = getNeighbors(q, eps)
             mark q as processed
             output q to the ordered list
             if (core-distance(q, eps, Minpts) != UNDEFINED)
                update(N', q, Seeds, eps, Minpts)

    update(N, p, Seeds, eps, Minpts)
    coredist = core-distance(p, eps, MinPts)
    for each o in N
       if (o is not processed)
          new-reach-dist = max(coredist, dist(p,o))
          if (o.reachability-distance == UNDEFINED) // o is not in Seeds
              o.reachability-distance = new-reach-dist
              Seeds.insert(o, new-reach-dist)
          else               // o in Seeds, check for improvement
              if (new-reach-dist < o.reachability-distance)
                 o.reachability-distance = new-reach-dist
                 Seeds.move-up(o, new-reach-dist)


      YOUTUBE LECTURE:
      https://www.youtube.com/watch?v=WebEVnnDRE4
    */

    console.log("HEJ");



}